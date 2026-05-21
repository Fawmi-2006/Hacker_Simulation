'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import Sidebar from '@/components/dashboard/Sidebar';
import ScanlineOverlay from '@/components/ui/ScanlineOverlay';
import MatrixRain from '@/components/ui/MatrixRain';

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, matrixMode } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <ScanlineOverlay />
      <MatrixRain active={matrixMode} />
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0 relative z-10">
        {children}
      </main>
    </div>
  );
}
