'use server';

import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:4000/api';

export async function getDeployments() {
    try {
        const res = await fetch(`${API_URL}/deployments`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch deployments');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createDeployment(formData: FormData) {
    const rawData = {
        project_name: formData.get('project_name'),
        tech_stack: formData.get('tech_stack'),
        github_repository_url: formData.get('github_repository_url'),
        subdomain: formData.get('subdomain'),
        branch: formData.get('branch') || 'main',
        nginx_port: formData.get('nginx_port') || 0
    };

    try {
        const res = await fetch(`${API_URL}/deployments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rawData),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create deployment');
        
        revalidatePath('/deployments');
        
        return { 
            success: true, 
            webhook_uuid: data.webhook_uuid,
            webhook_secret: data.webhook_secret 
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteDeployment(uuid: string) {
    try {
        await fetch(`${API_URL}/deployments/${uuid}`, { method: 'DELETE' });
        revalidatePath('/deployments');
    } catch (err) {
        console.error("Delete failed:", err);
    }
}
