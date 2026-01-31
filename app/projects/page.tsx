'use client';

import { useState, useEffect } from 'react';
import { getProjects, createProject, deleteProject } from '@/app/actions/projects';

// Type definition matching SQLite schema
type Project = {
  webhook_uuid: string;
  project_name: string;
  github_repository_url: string;
  deploy_path: string;
  tech_stack?: string;
  last_deployed_at?: string;
  webhook_secret: string;
};

export default function ProjectsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await createProject(formData);
    
    setIsCreating(false);
    loadProjects(); // Refresh list
  };

  const handleDelete = async (uuid: string) => {
    if(confirm('Are you sure? This cannot be undone.')) {
        await deleteProject(uuid);
        loadProjects();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between border-b border-sky-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-900 uppercase tracking-tight">Projects</h1>
          <p className="text-sm text-sky-600 mt-2 font-medium">Manage repositories and listeners</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className={`px-6 py-3 text-sm font-bold transition-colors duration-200 uppercase tracking-wider ${isCreating ? 'bg-sky-100 text-sky-900 hover:bg-sky-200' : 'bg-sky-600 text-white hover:bg-sky-800'}`}
        >
          {isCreating ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {/* Creation Form Panel */}
      {isCreating && (
        <div className="bg-white border border-sky-200 p-8 shadow-sm animate-pulse-once">
          <h3 className="text-lg font-bold text-sky-900 mb-6 uppercase tracking-wide border-b border-sky-100 pb-2">New Configuration</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">Project Name</label>
              <input name="project_name" required type="text" className="w-full bg-slate-50 border border-sky-200 p-3 text-sm text-sky-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-200" placeholder="e.g. My Portfolio" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">Tech Stack</label>
              <select name="tech_stack" className="w-full bg-slate-50 border border-sky-200 p-3 text-sm text-sky-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-200">
                <option value="html">HTML / Static</option>
                <option value="node">Node.js / Next.js</option>
                <option value="php">PHP / Laravel</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">Deploy Path (Absolute)</label>
              <input name="deploy_path" required type="text" className="w-full bg-slate-50 border border-sky-200 p-3 text-sm text-sky-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-200" placeholder="/var/www/my-project" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">Repository URL</label>
              <input name="github_repository_url" required type="text" className="w-full bg-slate-50 border border-sky-200 p-3 text-sm text-sky-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-200" placeholder="https://github.com/username/repo" />
            </div>
            
            <div className="col-span-2 pt-4">
               <button type="submit" className="w-full bg-sky-900 text-white p-4 text-sm font-bold hover:bg-black transition-colors duration-200 uppercase tracking-widest">
                 Initialize Webhook
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {isLoading && <div className="text-sky-500 text-sm">Loading projects from Tunnel...</div>}
        
        {!isLoading && projects.length === 0 && (
            <div className="p-8 text-center text-sky-400 border border-dashed border-sky-200">
                No active webhooks found. Create one to get started.
            </div>
        )}

        {projects.map((project) => (
            <div key={project.webhook_uuid} className="bg-white border border-sky-200 p-6 hover:border-sky-500 transition-all duration-200 group shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-sky-900">{project.project_name}</h3>
                    <span className="bg-sky-100 text-sky-700 text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
                        {project.tech_stack || 'Generic'}
                    </span>
                </div>
                <div className="text-sm text-sky-500 font-mono mt-2">{project.deploy_path}</div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={() => handleDelete(project.webhook_uuid)} className="bg-white text-red-600 border border-red-200 px-4 py-2 text-xs font-bold hover:bg-red-500 hover:text-white transition-colors uppercase">Delete</button>
                    <a href={project.github_repository_url} target="_blank" className="bg-white text-sky-600 border border-sky-200 px-4 py-2 text-xs font-bold hover:bg-sky-900 hover:text-white hover:border-sky-900 transition-colors uppercase">Repo</a>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-sky-100 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-sky-500 font-medium">
                    <div className={`w-2 h-2 ${project.last_deployed_at ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    {project.last_deployed_at ? `Last deployed: ${project.last_deployed_at}` : 'No deployments yet'}
                </div>
                <div className="text-right">
                    <div className="font-mono text-sky-300 select-all cursor-pointer" title="Click to copy UUID">UUID: {project.webhook_uuid}</div>
                    <div className="font-mono text-sky-200 select-all cursor-pointer text-[10px] mt-1" title="Webhook Secret">SEC: {project.webhook_secret.substring(0,8)}...</div>
                </div>
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}