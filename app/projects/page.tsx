'use client';

import { useState, useEffect } from 'react';
import { getAttachedProjects, attachProject, detachProject } from '@/app/actions/github-projects';
import { fetchUserRepos } from '@/app/actions/github-api';
import { detectRepository } from '@/app/actions/detect';

export default function ProjectsPage() {
    const [attached, setAttached] = useState<any[]>([]);
    const [available, setAvailable] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [attachedData, githubData] = await Promise.all([
            getAttachedProjects(),
            fetchUserRepos()
        ]);

        setAttached(attachedData);

        if (githubData.success) {
            const attachedUrls = (attachedData || []).map((p: any) => p.url_path.toLowerCase());
            const filtered = githubData.repos.filter((repo: any) => 
                !attachedUrls.includes(repo.html_url.toLowerCase())
            );
            setAvailable(filtered);
        }
        setIsLoading(false);
    };

    const handleAttach = async (repo: any) => {
        setProcessingId(repo.id);
        const detection = await detectRepository(repo.html_url);
        
        const projectData = {
            name: repo.name,
            owner: repo.owner.login,
            owner_type: repo.owner.type,
            description: repo.description || 'No description',
            url_path: repo.html_url,
            git_url: repo.clone_url,
            ssh_url: repo.ssh_url,
            visibility: repo.private ? 'private' : 'public',
            branch: detection.success ? detection.default_branch : repo.default_branch
        };

        const result = await attachProject(projectData);
        if (result.success) await loadData();
        setProcessingId(null);
    };

    const handleDetach = async (uuid: string) => {
        if (!confirm('Detach this project?')) return;
        const result = await detachProject(uuid);
        if (result.success) await loadData();
    };

    const filteredAvailable = (available || []).filter(repo => 
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.owner.login.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="max-w-6xl mx-auto space-y-10 p-6 font-sans">
            <header className="flex justify-between items-end border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-sky-900 leading-none">Projects</h1>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-3">Sync Local Database with GitHub Cloud</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="FILTER REPOSITORIES..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-50 border border-gray-200 px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-sky-500 w-72 placeholder:text-gray-300"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Attached ({attached.length})</h2>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attached.map((project) => (
                        <div key={project.project_uuid} className="bg-white border border-gray-200 p-6 flex justify-between items-center shadow-sm hover:border-sky-200 transition-colors group">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-black uppercase text-sm tracking-tight">{project.name}</h3>
                                    <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 font-black rounded-sm">{project.visibility}</span>
                                </div>
                                <p className="text-[10px] text-sky-600 font-bold mt-1 uppercase tracking-tighter truncate max-w-[250px]">{project.owner_login}</p>
                            </div>
                            <button 
                                onClick={() => handleDetach(project.project_uuid)}
                                className="text-[9px] font-black text-red-500 border border-red-100 px-4 py-2 hover:bg-red-500 hover:text-white uppercase tracking-widest transition-all"
                            >
                                Detach
                            </button>
                        </div>
                    ))}
                </div>
                {!isLoading && attached.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 text-[10px] font-black uppercase text-gray-300 tracking-widest">No projects attached to local database</div>
                )}
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Available ({filteredAvailable.length})</h2>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                                <th className="px-8 py-4">Repository Identity</th>
                                <th className="px-8 py-4 text-right">Synchronization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAvailable.map((repo) => (
                                <tr key={repo.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="font-black text-sm text-gray-900 tracking-tight">{repo.name}</div>
                                        <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1 flex items-center gap-2">
                                            {repo.owner.login} <span className="w-1 h-1 bg-gray-200 rounded-full"></span> {repo.language || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            disabled={processingId === repo.id}
                                            onClick={() => handleAttach(repo)}
                                            className="bg-black text-white text-[9px] font-black px-6 py-2.5 uppercase tracking-[0.2em] hover:bg-sky-600 disabled:bg-gray-200 transition-all shadow-sm"
                                        >
                                            {processingId === repo.id ? 'Processing...' : 'Attach Project'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isLoading && (
                        <div className="py-20 text-center">
                            <i className="fa-solid fa-circle-notch fa-spin text-sky-500 mb-4 text-xl"></i>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronizing GitHub Inventory</div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}