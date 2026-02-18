'use server';

import { revalidatePath } from 'next/cache';

const BOT_API_URL = process.env.BOT_API_URL || 'http://127.0.0.1:4000/api';
const VPS_IP = process.env.ARVO_VPS_IP || '127.0.0.1';

export async function getDNSRecords(page: number = 1, search: string = '') {
    try {
        const query = new URLSearchParams({ 
            page: page.toString(), 
            per_page: '20' 
        });
        if (search) query.append('name', search);

        const res = await fetch(`${BOT_API_URL}/cloudflare/records?${query}`, { 
            cache: 'no-store' 
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to fetch records');
        }
        
        return await res.json();
    } catch (error: any) {
        return { success: false, error: error.message, result: [] };
    }
}

export async function createSubdomainRecord(subdomain: string, comment: string = '') {
    try {
        const payload = {
            type: 'A',
            name: `${subdomain}.arvo.team`,
            content: VPS_IP,
            proxied: true,
            ttl: 1,
            comment: comment
        };

        const res = await fetch(`${BOT_API_URL}/cloudflare/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Creation failed');

        revalidatePath('/dns');
        return { success: true, result: data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteDNSRecord(recordId: string) {
    try {
        const res = await fetch(`${BOT_API_URL}/cloudflare/records/${recordId}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Delete failed');
        }

        revalidatePath('/dns');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCloudflareAnalytics(days: number = 30) {
    const BOT_API_URL = process.env.BOT_API_URL;
    
    try {
        const res = await fetch(`${BOT_API_URL}/cloudflare/dynamic-analytics?days=${days}`, { 
            cache: 'no-store',
            signal: AbortSignal.timeout(8000)
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error(`[Next.js Action] API Error (${res.status}): ${text}`);
            return { data: [], granularity: 'unknown' };
        }
        
        const result = await res.json();
        return {
            data: result.data || [],
            granularity: result.granularity || (days <= 3 ? 'hourly' : 'daily')
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.error(`[Next.js Action] Fetch timeout after 8s`);
            } else {
                console.error(`[Next.js Action] CRITICAL FETCH ERROR: ${error.message}`);
            }
        } else {
            console.error(`[Next.js Action] UNKNOWN ERROR TYPE:`, error);
        }
        
        return { data: [], granularity: 'error' };
    }
}