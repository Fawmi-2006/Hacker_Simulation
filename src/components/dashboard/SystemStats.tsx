'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

interface StatBar {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="cyber-progress w-full mt-1">
      <motion.div
        className="cyber-progress-bar"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)`, boxShadow: `0 0 6px ${color}` }}
      />
    </div>
  );
}

export default function SystemStats() {
  const [stats, setStats] = useState({ cpu: 34, ram: 61, disk: 47, net: 28 });

  useEffect(() => {
    const id = setInterval(() => {
      setStats(prev => ({
        cpu:  Math.max(5,  Math.min(98, prev.cpu  + (Math.random() - 0.5) * 8)),
        ram:  Math.max(20, Math.min(95, prev.ram  + (Math.random() - 0.5) * 3)),
        disk: Math.max(20, Math.min(90, prev.disk + (Math.random() - 0.5) * 1)),
        net:  Math.max(0,  Math.min(100,prev.net  + (Math.random() - 0.5) * 20)),
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const bars: StatBar[] = [
    { label: 'CPU',    value: stats.cpu,  icon: <Cpu  size={12} />, color: '#00ff41' },
    { label: 'RAM',    value: stats.ram,  icon: <Activity size={12} />, color: '#00f5ff' },
    { label: 'DISK',   value: stats.disk, icon: <HardDrive size={12} />, color: '#bf00ff' },
    { label: 'NETOUT', value: stats.net,  icon: <Wifi size={12} />, color: '#ff8c00' },
  ];

  return (
    <GlassPanel className="text-neon-green">
      <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-3">SYS METRICS</h3>
      <div className="space-y-3">
        {bars.map(({ label, value, icon, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5" style={{ color }}>
                {icon} {label}
              </span>
              <span className="font-mono" style={{ color }}>
                {Math.round(value)}%
              </span>
            </div>
            <AnimatedBar value={value} color={color} />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
