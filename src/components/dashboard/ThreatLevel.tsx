'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';
import { useAppStore } from '@/store/appStore';
import { ShieldAlert } from 'lucide-react';

const THREAT_CONFIG = [
  { label: 'NOMINAL',  color: '#00ff41', bg: 'rgba(0,255,65,0.05)',  bars: 1 },
  { label: 'MODERATE', color: '#aaff00', bg: 'rgba(170,255,0,0.05)', bars: 2 },
  { label: 'ELEVATED', color: '#ff8c00', bg: 'rgba(255,140,0,0.05)', bars: 3 },
  { label: 'CRITICAL', color: '#ff0040', bg: 'rgba(255,0,64,0.05)',  bars: 4 },
];

const EVENT_FEED = [
  'Probe detected: 94.21.183.47 → port 22',
  'Tor circuit recycled (hop change)',
  'IDS alert: SYN flood attempt mitigated',
  'Auth anomaly: 3 failed attempts, admin',
  'Outbound TLS handshake: 203.0.113.77',
  'MAC spoof confirmed: eth0',
  'Zero-day signature updated: CVE-2077-1337',
  'Firewall rule triggered: 47.21.198.33',
  'Honeypot interaction: 192.168.1.200',
];

export default function ThreatLevel() {
  const { threatLevel, setThreatLevel } = useAppStore();
  const [events, setEvents] = useState<string[]>([]);
  const config = THREAT_CONFIG[Math.min(threatLevel, 3)];

  useEffect(() => {
    
    const id = setInterval(() => {
      const event = EVENT_FEED[Math.floor(Math.random() * EVENT_FEED.length)];
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      setEvents(prev => [`[${ts}] ${event}`, ...prev.slice(0, 4)]);

      if (Math.random() < 0.15) {
        setThreatLevel(Math.max(0, Math.min(3, threatLevel + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 3500);
    return () => clearInterval(id);
  }, [threatLevel, setThreatLevel]);

  return (
    <GlassPanel color={threatLevel >= 3 ? 'red' : 'green'}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-cyber tracking-widest text-gray-500">THREAT LEVEL</h3>
        <ShieldAlert size={14} style={{ color: config.color }} />
      </div>

      {}
      <div className="flex items-end gap-1 mb-3 h-10">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              height: i <= threatLevel ? `${(i + 1) * 25}%` : '10%',
              opacity: i <= threatLevel ? 1 : 0.2,
            }}
            transition={{ duration: 0.4 }}
            className="flex-1 rounded-sm"
            style={{
              background: i <= threatLevel ? config.color : '#333',
              boxShadow: i <= threatLevel ? `0 0 8px ${config.color}` : undefined,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-3">
        <motion.p
          key={config.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-cyber font-bold tracking-widest"
          style={{ color: config.color, textShadow: `0 0 10px ${config.color}` }}
        >
          {config.label}
        </motion.p>
      </div>

      {}
      <div className="space-y-1 max-h-20 overflow-hidden">
        {events.map((e, i) => (
          <motion.p
            key={e + i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1 - i * 0.2, x: 0 }}
            className="text-[10px] font-mono text-gray-600 truncate"
          >
            {e}
          </motion.p>
        ))}
      </div>
    </GlassPanel>
  );
}
