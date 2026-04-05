'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Target, Users, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="flex flex-col items-center gap-3">
          <Zap size={32} className="text-violet-500 animate-pulse" />
          <span className="text-gray-400">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/objectives', label: 'Objetivos', icon: Target },
    { href: '/groups', label: 'Grupos', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-64 bg-surface-card border-r border-surface-lighter flex flex-col">
        <div className="p-6 border-b border-surface-lighter">
          <Link href="/objectives" className="flex items-center gap-2">
            <Zap size={24} className="text-violet-500" />
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              TimeSkip
            </h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-500/15 text-violet-400 glow-purple'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-lighter'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-lighter">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 truncate">{profile?.username || user.email}</span>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-surface">
        {children}
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AuthProvider>
  );
}
