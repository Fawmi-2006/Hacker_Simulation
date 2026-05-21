'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';

interface ServerNode {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'warning' | 'offline';
  ping: number;
  load: number;
}

const SERVERS: ServerNode[] = [
  { id: 's1', name: 'GHOST-RELAY-01', ip: '10.0.0.1',    status: 'online',  ping: 12,  load: 34 },
  { id: 's2', name: 'TOR-EXIT-NODE',  ip: '172.16.0.99', status: 'online',  ping: 44,  load: 67 },
  { id: 's3', name: 'VPN-ENDPOINT',   ip: '10.8.0.1',    status: 'online',  ping: 8,   load: 21 },
  { id: 's4', name: 'C2-SERVER',      ip: '192.168.99.1',status: 'warning', ping: 210, load: 89 },
  { id: 's5', name: 'DARKNET-RELAY',  ip: '10.0.1.44',   status: 'online',  ping: 31,  load: 55 },
  { id: 's6', name: 'BACKUP-NODE',    ip: '10.0.2.10',   status: 'offline', ping: 0,   load: 0  },
];

const STATUS_CONFIG = {
  online:  { color: '#00ff41', label: 'ONLINE'  },
  warning: { color: '#ff8c00', label: 'WARN'    },
  offline: { color: '#444',    label: 'OFFLINE' },
};

export default function ServerStatus() {
  const [servers, setServers] = useState(SERVERS);

  useEffect(() => {
    const id = setInterval(() => {
      setServers(prev => prev.map(s => ({
        ...s,
        ping: s.status === 'offline' ? 0 : Math.max(1, s.ping + Math.floor(Math.random() * 20) - 10),
        load: s.status === 'offline' ? 0 : Math.max(5, Math.min(98, s.load + Math.floor(Math.random() * 10) - 5)),
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassPanel className="text-neon-green">
      <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-3">SERVER STATUS</h3>
      <div className="space-y-2">
        {servers.map((s) => {
          const cfg = STATUS_CONFIG[s.status];
          return (
            <motion.div
              key={s.id}
              className="flex items-center gap-2 text-xs font-mono"
              whileHover={{ x: 2 }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                animate={s.status === 'online' ? { opacity: [1, 0.4, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ backgroundColor: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate text-gray-300 text-[11px]">{s.name}</span>
                  <span className="text-[10px] ml-1" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-600 text-[10px]">{s.ip}</span>
                  {s.status !== 'offline' && (
                    <>
                      <span className="text-gray-600 text-[10px]">{s.ping}ms</span>
                      <div className="flex-1 cyber-progress">
                        <div
                          className="cyber-progress-bar"
                          style={{
                            width: `${s.load}%`,
                            background: s.load > 80 ? '#ff0040' : s.load > 60 ? '#ff8c00' : '#00ff41',
                            transition: 'width 0.8s ease',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
