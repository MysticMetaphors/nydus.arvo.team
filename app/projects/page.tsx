'use client';

import { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { getAttachedProjects, attachProject, detachProject } from '@/app/actions/github-projects';
import { fetchUserRepos } from '@/app/actions/github-api';
import { detectRepository } from '@/app/actions/detect';
import { checkIntegrations } from '@/app/actions/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RippleButton = ({ children, onClick, className, disabled, type = 'button' }: any) => {
  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    const existing = button.getElementsByClassName('ripple')[0];
    if (existing) existing.remove();
    button.appendChild(circle);
    if (onClick) onClick(event);
  };
  return (
    <button type={type} disabled={disabled} onClick={createRipple} className={`relative overflow-hidden transition-all duration-200 ${className}`}>
      <span className="relative z-10">{children}</span>
      <style jsx global>{`
        span.ripple { position: absolute; border-radius: 50%; transform: scale(0); animation: ripple 600ms linear; background-color: rgba(255, 255, 255, 0.3); pointer-events: none; }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
      `}</style>
    </button>
  );
};

export default function ProjectsPage() {
  const [attached, setAttached] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [patKey, setPatKey] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    checkIntegrations().then((status) => setPatKey(status.hasPat));
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [attachedData, githubData] = await Promise.all([
      getAttachedProjects(),
      fetchUserRepos()
    ]);

    setAttached(attachedData || []);

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
      description: repo.description || '',
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
    if (!confirm('Are you sure? This cannot be undone.')) return;
    const result = await detachProject(uuid);
    if (result.success) await loadData();
  };

  const filteredAvailable = available.filter(repo => 
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    repo.owner.login.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 max-w-5xl">
      
      <div className="flex items-end justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Manage repositories and synchronization</p>
        </div>
        <div className="relative">
          <Input 
            placeholder="Search repositories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border text-foreground min-w-64"
          />
        </div>
      </div>

      {!patKey && (
        <Alert className="bg-amber-950/30 border-amber-700/50 text-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
              <span><strong>Setup Required:</strong> Configure your GitHub PAT to sync repositories.</span>
            </div>
            <Link href="/settings?from=projects" className="text-amber-200 underline font-bold hover:text-amber-300 text-xs uppercase tracking-wide">
              Setup Git Key →
            </Link>
          </div>
        </Alert>
      )}

      {/* SECTION: ATTACHED PROJECTS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-2">Attached Projects</h3>
        <div className="grid gap-4">
          {attached.map((project) => (
            <Card key={project.project_uuid} className="p-6 border-border bg-card hover:border-primary transition-all duration-200 group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {project.visibility}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono mt-2 font-medium">
                    {project.owner_login}
                  </div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDetach(project.project_uuid)}
                    className="text-xs uppercase"
                  >
                    Detach
                  </Button>
                  <a href={project.url_path} target="_blank" className="inline-block bg-foreground text-background px-4 py-2 text-xs font-bold hover:bg-foreground/90 transition-colors uppercase">
                    Repo
                  </a>
                </div>
              </div>
            </Card>
          ))}
          {!isLoading && attached.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-dashed border-border bg-secondary">
              No projects attached to local database.
            </Card>
          )}
        </div>
      </div>

      {/* SECTION: AVAILABLE REPOSITORIES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-2">Available on GitHub</h3>
        <Card className="border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary">
                <TableHead className="text-foreground font-bold uppercase text-xs">Repository</TableHead>
                <TableHead className="text-right text-foreground font-bold uppercase text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAvailable.map((repo) => (
                <TableRow key={repo.id} className="border-border hover:bg-secondary transition-colors">
                  <TableCell>
                    <div className="font-bold text-sm text-foreground">{repo.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{repo.owner.login} • {repo.language || 'Code'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RippleButton
                      disabled={processingId === repo.id}
                      onClick={() => handleAttach(repo)}
                      className={cn(
                        "bg-foreground text-background px-4 py-2 text-xs font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed",
                        processingId === repo.id ? "opacity-50" : ""
                      )}
                    >
                      {processingId === repo.id ? 'Attaching...' : 'Attach Project'}
                    </RippleButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Syncing with GitHub...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}