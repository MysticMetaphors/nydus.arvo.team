'use server';

export async function getServiceLogs(service: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/maintenance/logs/${service}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch logs for ${service}`);
        const data = await res.json();
        return { success: true, logs: data.logs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}