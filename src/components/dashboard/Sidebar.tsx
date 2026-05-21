'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import GlitchText from '@/components/ui/GlitchText';
import {
  TerminalSquare, Target, Radio, Settings, LogOut,
  ChevronLeft, ChevronRight, Database, Wifi, ShieldAlert,
  BookOpen, Volume2, VolumeX,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'DASHBOARD', icon: Radio          },
  { href: '/terminal',   label: 'TERMINAL',  icon: TerminalSquare },
  { href: '/missions',   label: 'MISSIONS',  icon: Target         },
  { href: '/darknet',    label: 'DARKNET',   icon: Database       },
  { href: '/settings',   label: 'SETTINGS',  icon: Settings       },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, sidebarCollapsed, setSidebarCollapsed, soundEnabled, setSoundEnabled, threatLevel } = useAppStore();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const threatColors = ['text-neon-green', '#aaff00', 'text-neon-orange', 'text-neon-red'];
  const threatLabels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 60 : 220 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 h-screen flex flex-col glass-panel border-r border-neon-green/20 relative z-20"
    >
      {}
      <div className="p-3 border-b border-neon-green/20 flex items-center gap-2 min-h-[56px]">
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden">
            <GlitchText text="GHOST OS" size="sm" className="text-neon-green block" />
            <p className="text-xs text-gray-600 truncate">v7.4.2-null</p>
          </motion.div>
        )}
        <motion.div
          className="w-2 h-2 rounded-full bg-neon-green animate-pulse flex-shrink-0"
          style={{ boxShadow: '0 0 8px #00ff41' }}
        />
      </div>

      {}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyber-dark border border-neon-green/40 flex items-center justify-center text-neon-green hover:border-neon-green transition-colors z-30"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {}
      {!sidebarCollapsed && user && (
        <div className="px-3 py-2 border-b border-neon-green/10">
          <p className="text-neon-cyan text-xs">{user.handle}</p>
          <p className="text-gray-600 text-xs">LVL {user.level} · {user.xp} XP</p>
        </div>
      )}

      {}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <motion.button
              key={href}
              whileHover={{ x: 2 }}
              onClick={() => router.push(href)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider
                transition-all duration-200 relative group
                ${active
                  ? 'text-neon-green bg-neon-green/5 border-r-2 border-neon-green'
                  : 'text-gray-500 hover:text-neon-green hover:bg-neon-green/5'}
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                  {label}
                </motion.span>
              )}
              {active && <span className="absolute inset-0 bg-neon-green/3" />}
            </motion.button>
          );
        })}
      </nav>

      {}
      <div className="border-t border-neon-green/10 p-2 space-y-1">
        {}
        {!sidebarCollapsed && (
          <div className="px-2 py-1">
            <p className="text-neon-green/60 text-xs font-mono">{time}</p>
          </div>
        )}

        {}
        {!sidebarCollapsed && (
          <div className="px-2 py-1 flex items-center gap-2">
            <ShieldAlert size={12} className="text-gray-600" />
            <span className="text-xs" style={{ color: threatColors[threatLevel] }}>
              THREAT: {threatLabels[threatLevel]}
            </span>
          </div>
        )}

        {}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-neon-cyan text-xs transition-colors"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {!sidebarCollapsed && <span>{soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>}
        </button>

        {}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-neon-red text-xs transition-colors"
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span>DISCONNECT</span>}
        </button>
      </div>
    </motion.aside>
  );
}
