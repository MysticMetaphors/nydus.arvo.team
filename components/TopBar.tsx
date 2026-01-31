'use client';

import { usePathname } from 'next/navigation';

export default function TopBar() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="w-full h-16 bg-white border-b border-sky-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        {/* Logo / Title */}
        <div className="font-bold text-xl text-sky-900 tracking-tight uppercase flex items-baseline gap-1">
          Nydus <span className="text-sky-500 text-xs">.arvo.team</span>
        </div>
        
        {/* Breadcrumbs */}
        <div className="h-6 w-px bg-sky-200"></div>
        <div className="text-sm text-sky-500 font-mono flex gap-2 uppercase tracking-wider text-xs">
          <span>root</span>
          {pathSegments.map((segment, index) => (
            <span key={index} className="flex gap-2">
              <span>/</span>
              <span className={index === pathSegments.length - 1 ? 'text-sky-900 font-bold' : ''}>
                {segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* User Profile Stub */}
      <div className="flex items-center gap-3 text-sm font-bold text-sky-900 cursor-pointer hover:bg-sky-50 px-3 py-2 transition-colors duration-200">
        <span>ADMINISTRATOR</span>
        <div className="w-8 h-8 bg-sky-900 text-white flex items-center justify-center text-xs font-mono">AD</div>
      </div>
    </header>
  );
}