'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'fa-chart-line' },
    { name: 'Projects', path: '/projects', icon: 'fa-network-wired' },
    { name: 'Deployments', path: '/deployments', icon: 'fa-rocket' },
    { name: 'Settings', path: '/settings', icon: 'fa-cogs' },
  ];

  return (
    <nav className="h-full bg-white flex flex-col py-6">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`
                px-6 py-3 text-sm flex items-center gap-4 transition-all duration-200
                ${isActive 
                  ? 'bg-sky-100 text-sky-900 font-bold border-r-4 border-sky-600' 
                  : 'text-black-600 hover:bg-sky-50 hover:text-sky-800'}
              `}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto px-6 py-6">
        <div className="bg-sky-50 p-4 border border-sky-200 text-xs text-sky-700">
          <div className="font-bold mb-2 uppercase tracking-wide">System Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-500 animate-pulse"></div>
            <span className="font-mono">ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}