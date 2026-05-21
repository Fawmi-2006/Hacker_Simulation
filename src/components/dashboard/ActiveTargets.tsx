'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';
import type { FakeTarget } from '@/types';
import { FAKE_HOSTS } from '@/lib/terminal/simulator';

const TARGETS: FakeTarget[] = FAKE_HOSTS.map((h, i) => ({
  ip: h.ip,
  hostname: h.hostname,
  os: h.os,
  ports: [22, 80, 443],
  status: i === 0 ? 'compromised' : i === 1 ? 'active' : i === 4 ? 'offline' : 'active',
  threat: Math.floor(Math.random() * 5) + 1,
}));

const STATUS_COLORS: Record<string, string> = {
  active:      '#00f5ff',
  compromised: '#00ff41',
  offline:     '#555',
};

export default function ActiveTargets() {
  const [targets, setTargets] = useState(TARGETS);

  useEffect(() => {
    const id = setInterval(() => {
      setTargets(prev => prev.map(t => ({
        ...t,
        threat: t.status === 'offline' ? 0 : Math.max(1, Math.min(9, t.threat + Math.floor(Math.random() * 3) - 1)),
      })));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassPanel className="text-neon-green">
      <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-3">ACTIVE TARGETS</h3>
      <div className="space-y-2">
        {targets.map((t) => (
          <motion.div
            key={t.ip}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-neon-green/5 last:border-0"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: STATUS_COLORS[t.status],
                  boxShadow: `0 0 4px ${STATUS_COLORS[t.status]}`,
                  animation: t.status !== 'offline' ? 'pulse 2s infinite' : undefined,
                }}
              />
              <div>
                <p style={{ color: STATUS_COLORS[t.status] }}>{t.ip}</p>
                <p className="text-gray-600 text-[10px] truncate max-w-[120px]">{t.hostname.split('.')[0]}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase">{t.status}</p>
              <p className="text-[10px]" style={{ color: t.threat > 6 ? '#ff0040' : t.threat > 3 ? '#ff8c00' : '#00ff41' }}>
                THREAT {t.threat}/9
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
