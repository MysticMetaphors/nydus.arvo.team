'use server';

import { cookies } from 'next/headers';

export async function fetchUserRepos() {
    const cookieStore = await cookies();
    const pat = cookieStore.get('nydus_pat')?.value;

    if (!pat) return { success: false, error: 'Missing GitHub PAT' };

    try {
        const res = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Nydus-Tunnel'
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) return { success: false, error: 'GitHub API Error' };
        
        const repos = await res.json();
        return { success: true, repos };
    } catch (error) {
        return { success: false, error: 'Failed to connect to GitHub' };
    }
}
