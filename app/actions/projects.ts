'use server';

import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:4000/api';

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createProject(formData: FormData) {
  const rawData = {
    project_name: formData.get('project_name'),
    tech_stack: formData.get('tech_stack'),
    github_repository_url: formData.get('github_repository_url'),
    deploy_path: formData.get('deploy_path'), // Added this field to form
    branch: 'main'
  };

  try {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawData),
    });
    
    if (!res.ok) throw new Error('Failed to create project');
    
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create project' };
  }
}

export async function deleteProject(uuid: string) {
    await fetch(`${API_URL}/projects/${uuid}`, { method: 'DELETE' });
    revalidatePath('/projects');
}