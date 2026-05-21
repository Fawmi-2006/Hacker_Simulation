'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import TerminalEmulator from '@/components/terminal/TerminalEmulator';
import { useAppStore } from '@/store/appStore';
import { Maximize2, Minimize2, Info, Bot } from 'lucide-react';

export default function TerminalPage() {
  const { connectedTarget, currentDir, activeMission } = useAppStore();
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  return (
    <div className="flex h-full">
      {}
      <div className="flex-1 flex flex-col min-w-0">
        {}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neon-green/20 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-neon-red/60" />
              <span className="w-3 h-3 rounded-full bg-neon-orange/60" />
              <span className="w-3 h-3 rounded-full bg-neon-green/60" />
            </div>
            <span className="text-xs font-mono text-gray-600">
              ghost@null:{currentDir}
              {connectedTarget && <span className="text-neon-cyan ml-2">[{connectedTarget}]</span>}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            {activeMission && (
              <span className="text-neon-cyan/60 flex items-center gap-1">
                <Info size={10} /> {activeMission.title}
              </span>
            )}
            <button
              onClick={() => setAiPanelOpen(p => !p)}
              className="text-gray-600 hover:text-neon-cyan transition-colors flex items-center gap-1"
            >
              <Bot size={14} />
              <span className="hidden md:inline">ORACLE</span>
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 min-h-0">
          <TerminalEmulator />
        </div>
      </div>

      {}
      <motion.div
        animate={{ width: aiPanelOpen ? 280 : 0, opacity: aiPanelOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 overflow-hidden border-l border-neon-cyan/20 bg-black/80"
      >
        {aiPanelOpen && <OraclePanel />}
      </motion.div>
    </div>
  );
}

function OraclePanel() {
  const [messages, setMessages] = useState([
    { role: 'ai' as const, text: 'ORACLE online. The network is watching. Ask me anything.' },
  ]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: data.message || '...' }]);
      }, 400);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Signal lost. Try again.' }]);
    }
  };

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-cyan/20">
        <Bot size={14} className="text-neon-cyan" />
        <span className="text-xs font-cyber text-neon-cyan tracking-widest">ORACLE AI</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3 text-xs font-mono">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded-sm text-xs leading-4 ${
              m.role === 'ai'
                ? 'glass-panel-cyan text-neon-cyan/80'
                : 'bg-neon-green/5 text-gray-400 border border-neon-green/10'
            }`}
          >
            {m.role === 'ai' && <span className="text-neon-cyan font-bold text-[10px] block mb-1">ORACLE:</span>}
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-1">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask ORACLE..."
          className="flex-1 bg-transparent border border-neon-cyan/20 text-neon-cyan/80 text-xs font-mono px-2 py-1.5 focus:outline-none focus:border-neon-cyan placeholder:text-gray-700"
        />
        <button
          onClick={send}
          className="px-2 py-1.5 border border-neon-cyan/30 text-neon-cyan/60 hover:text-neon-cyan text-xs font-mono transition-colors"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
