'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import Sidebar from '@/components/dashboard/Sidebar';
import ScanlineOverlay from '@/components/ui/ScanlineOverlay';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  useEffect(() => { if (!isAuthenticated) router.replace('/'); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-cyber-dark overflow-hidden">
      <ScanlineOverlay />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 relative z-10">{children}</main>
    </div>
  );
}
