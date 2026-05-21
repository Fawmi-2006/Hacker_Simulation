'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import GlitchText from '@/components/ui/GlitchText';
import GlassPanel from '@/components/ui/GlassPanel';
import SystemStats from '@/components/dashboard/SystemStats';
import ServerStatus from '@/components/dashboard/ServerStatus';
import PacketMonitor from '@/components/dashboard/PacketMonitor';
import WorldMap from '@/components/dashboard/WorldMap';
import ThreatLevel from '@/components/dashboard/ThreatLevel';
import ActiveTargets from '@/components/dashboard/ActiveTargets';
import { useRouter } from 'next/navigation';
import { TerminalSquare, Target } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

export default function DashboardPage() {
  const { user, missions, userMissions, setMissions, setUserMissions } = useAppStore();
  const router = useRouter();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    
    fetch('/api/missions', { headers: { Authorization: `Bearer ${localStorage.getItem('hacker-sim-store') ? JSON.parse(localStorage.getItem('hacker-sim-store')!).state?.token : ''}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.missions) setMissions(d.missions); if (d?.userMissions) setUserMissions(d.userMissions); })
      .catch(() => {});
  }, [setMissions, setUserMissions]);

  const activeMissions   = userMissions.filter(m => m.status === 'in_progress').length;
  const completedMissions = userMissions.filter(m => m.status === 'completed').length;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {}
      <div className="flex items-center justify-between">
        <div>
          <GlitchText text="COMMAND CENTER" size="xl" className="text-neon-green block" />
          <p className="text-gray-600 text-xs font-mono mt-0.5">
            OPERATOR: {user?.handle} · LVL {user?.level} · {user?.xp} XP · {user?.rep} REP
          </p>
        </div>
        <div className="text-right">
          <p className="text-neon-green font-cyber text-lg" style={{ textShadow: '0 0 10px #00ff41' }}>
            {time}
          </p>
          <p className="text-gray-600 text-xs font-mono">2077-05-20</p>
        </div>
      </div>

      {}
      <div className="flex gap-3">
        <NeonButton onClick={() => router.push('/terminal')} icon={<TerminalSquare size={14} />} size="sm">
          OPEN TERMINAL
        </NeonButton>
        <NeonButton onClick={() => router.push('/missions')} color="cyan" icon={<Target size={14} />} size="sm">
          MISSIONS
        </NeonButton>
      </div>

      {}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'ACTIVE OPS',  value: activeMissions,   color: '#00f5ff' },
          { label: 'COMPLETED',   value: completedMissions, color: '#00ff41' },
          { label: 'REPUTATION',  value: user?.rep ?? 0,   color: '#bf00ff' },
          { label: 'LEVEL',       value: user?.level ?? 1,  color: '#ff8c00' },
        ].map(({ label, value, color }) => (
          <GlassPanel key={label} noPadding className="p-3 text-center">
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-cyber font-bold"
              style={{ color, textShadow: `0 0 10px ${color}` }}
            >
              {value}
            </motion.p>
            <p className="text-gray-600 text-[10px] tracking-widest mt-0.5">{label}</p>
          </GlassPanel>
        ))}
      </div>

      {}
      <div className="grid grid-cols-12 gap-3">
        {}
        <div className="col-span-3 space-y-3">
          <SystemStats />
          <ThreatLevel />
        </div>

        {}
        <div className="col-span-6 space-y-3">
          <WorldMap />
          <PacketMonitor />
        </div>

        {}
        <div className="col-span-3 space-y-3">
          <ServerStatus />
          <ActiveTargets />
        </div>
      </div>

      {}
      <GlassPanel color="cyan">
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-2">RECENT INTEL</h3>
        <div className="space-y-1 text-xs font-mono text-neon-cyan/60">
          {[
            '[2077-05-20 03:14] NeoCorp detected scanning activity on port 443',
            '[2077-05-20 02:59] Syndicate moved asset from 10.0.0.88 to 10.0.0.91',
            '[2077-05-20 02:30] ORACLE signal detected on BAND-7 frequency',
            '[2077-05-20 01:44] Shadow Parliament DAO transferred 847 XMR',
            '[2077-05-20 00:02] Intrusion attempt on Ghost relay blocked',
          ].map((e, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {e}
            </motion.p>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
