'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';
import type { NetworkPacket } from '@/types';
import { randomIP, randomHex } from '@/lib/terminal/simulator';

const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'TLS', 'DNS', 'SSH'];

function generatePacket(): NetworkPacket {
  return {
    id: randomHex(4),
    src: randomIP(),
    dst: randomIP(),
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    size: Math.floor(Math.random() * 1400) + 64,
    timestamp: Date.now(),
    flagged: Math.random() < 0.08,
  };
}

export default function PacketMonitor() {
  const [packets, setPackets] = useState<NetworkPacket[]>(() =>
    Array.from({ length: 8 }, generatePacket)
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setPackets(prev => [generatePacket(), ...prev.slice(0, 11)]);
    }, 800);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <GlassPanel className="text-neon-green" color="cyan">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-cyber tracking-widest text-gray-500">PACKET MONITOR</h3>
        <button
          onClick={() => setPaused(p => !p)}
          className="text-xs text-neon-cyan/60 hover:text-neon-cyan transition-colors"
        >
          {paused ? '▶ RESUME' : '⏸ PAUSE'}
        </button>
      </div>

      <div className="text-[10px] font-mono">
        <div className="grid grid-cols-5 text-gray-600 pb-1 border-b border-neon-cyan/10 mb-1">
          <span>ID</span>
          <span>SRC</span>
          <span>DST</span>
          <span>PROTO</span>
          <span className="text-right">SIZE</span>
        </div>
        <div className="space-y-0.5 max-h-44 overflow-hidden">
          <AnimatePresence>
            {packets.map((pkt) => (
              <motion.div
                key={pkt.id + pkt.timestamp}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`grid grid-cols-5 py-0.5 ${pkt.flagged ? 'text-neon-red' : 'text-neon-cyan/70'}`}
              >
                <span className="truncate">{pkt.id}</span>
                <span className="truncate">{pkt.src.split('.').slice(0, 2).join('.')}…</span>
                <span className="truncate">{pkt.dst.split('.').slice(0, 2).join('.')}…</span>
                <span>{pkt.protocol}</span>
                <span className="text-right">{pkt.size}B</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </GlassPanel>
  );
}
