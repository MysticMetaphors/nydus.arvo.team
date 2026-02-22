'use client';

import { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationContextType {
  isPending: boolean;
  pendingPath: string | null;
  navigate: (href: string) => void;
  activePath: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const navigate = (href: string) => {
    if (href === pathname) return; // already on that page
    setPendingPath(href);
    startTransition(() => {
      router.push(href);
    });
  };

  // Clear pending path once navigation completes
  useEffect(() => {
    if (pendingPath && pathname === pendingPath) {
      setPendingPath(null);
    }
  }, [pathname, pendingPath]);

  const activePath = pendingPath || pathname;

  return (
    <NavigationContext.Provider value={{ isPending, pendingPath, navigate, activePath }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}