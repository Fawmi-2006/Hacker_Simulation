'use client';
import {
  useState, useRef, useEffect, useCallback, KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { parseCommand } from '@/lib/terminal/commands';
import { generateAIResponse } from '@/lib/ai/assistant';
import { checkCommandAgainstMission } from '@/lib/missions/engine';
import type { TerminalLine } from '@/types';
import { useRouter } from 'next/navigation';

const BOOT_SEQUENCE = [
  '╔════════════════════════════════════════════╗',
  '║          GHOST OS v7.4.2-null              ║',
  '║   Secure Terminal — Simulation Mode Only   ║',
  '╚════════════════════════════════════════════╝',
  '',
  '[BOOT] Initializing kernel modules...',
  '[BOOT] Loading firewall rules... 2847 active',
  '[BOOT] Establishing Tor circuit...',
  '[BOOT] Tor circuit ready: 5 hops',
  '[BOOT] Spoofing MAC address... done',
  '[BOOT] Identity masked.',
  '[BOOT] System ready.',
  '',
  '  ⚠  THIS IS A SIMULATION. No real commands execute.',
  '  ⚠  All outputs are fictional and sandboxed.',
  '',
  'Type \'help\' for available commands.',
  '',
];

let lineIdCounter = 0;
function mkLine(text: string, type: TerminalLine['type'] = 'output'): TerminalLine {
  return { id: String(lineIdCounter++), text, type };
}

export default function TerminalEmulator() {
  const router = useRouter();
  const {
    user, currentDir, connectedTarget,
    setCurrentDir, setConnectedTarget,
    matrixMode, setMatrixMode, setGlitchActive,
    activeMission, userMissions, updateMissionProgress,
    settings,
  } = useAppStore();

  const [lines, setLines]           = useState<TerminalLine[]>([]);
  const [input, setInput]           = useState('');
  const [history, setHistory]       = useState<string[]>([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const [busy, setBusy]             = useState(false);
  const [booted, setBooted]         = useState(false);
  const [aiMode, setAiMode]         = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const scrollBottom = () => {
    setTimeout(() => {
      if (outputRef.current)
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, 30);
  };

  useEffect(() => {
    if (booted) return;
    setBooted(true);
    let i = 0;
    const type = () => {
      if (i >= BOOT_SEQUENCE.length) return;
      setLines(prev => [...prev, mkLine(BOOT_SEQUENCE[i], i < 3 ? 'system' : i === 14 ? 'warning' : i === 15 ? 'warning' : 'output')]);
      i++;
      scrollBottom();
      setTimeout(type, i < 10 ? 80 : 30);
    };
    setTimeout(type, 200);
  }, [booted]);

  const appendLines = useCallback((newLines: TerminalLine[], baseDelay = 0) => {
    setBusy(true);
    let delay = baseDelay;
    newLines.forEach((l, idx) => {
      const d = l.delay ?? (idx * 0);
      setTimeout(() => {
        setLines(prev => [...prev, l]);
        scrollBottom();
        if (idx === newLines.length - 1) setBusy(false);
      }, delay + d);
      delay += l.delay ?? 0;
    });
    if (newLines.length === 0) setBusy(false);
  }, []);

  const streamLines = useCallback((texts: string[], type: TerminalLine['type'], perLineDelay: number, initial = 0) => {
    setBusy(true);
    texts.forEach((text, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, mkLine(text, type)]);
        scrollBottom();
        if (i === texts.length - 1) setBusy(false);
      }, initial + i * perLineDelay);
    });
    if (texts.length === 0) setBusy(false);
  }, []);

  const handleCommand = useCallback(async (raw: string) => {
    const input = raw.trim();
    if (!input) return;

    const prompt = `${user?.handle || 'ghost'}@null:${currentDir}${connectedTarget ? ` [${connectedTarget}]` : ''}$ `;
    setLines(prev => [...prev, mkLine(prompt + input, 'input')]);
    setHistory(prev => [input, ...prev.slice(0, 49)]);
    setHistIdx(-1);
    scrollBottom();

    if (aiMode || input.startsWith('ai ')) {
      const msg = input.startsWith('ai ') ? input.slice(3) : input;
      const resp = generateAIResponse(msg);
      setTimeout(() => {
        setLines(prev => [
          ...prev,
          mkLine(`[ORACLE] ${resp.message}`, resp.emotion === 'warning' ? 'warning' : resp.emotion === 'hint' ? 'success' : 'system'),
        ]);
        scrollBottom();
      }, 400);
      return;
    }

    const result = parseCommand(input, {
      currentDir,
      connectedTarget,
      user: user?.handle || 'ghost',
    });

    if (result.special === 'clear') {
      setLines([]);
      return;
    }
    if (result.special === 'matrix') {
      setMatrixMode(!matrixMode);
      return;
    }
    if (result.special === 'missions') {
      router.push('/missions');
      return;
    }
    if (result.special === 'glitch') {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 3000);
    }

    if (result.newDir !== undefined)    setCurrentDir(result.newDir);
    if (result.newTarget !== undefined) setConnectedTarget(result.newTarget);

    if (activeMission) {
      const um = userMissions.find(u => u.mission_id === activeMission.id);
      if (um && um.status === 'in_progress') {
        const check = checkCommandAgainstMission(input, activeMission, um);
        if (check.stageComplete) {
          setTimeout(() => {
            setLines(prev => [
              ...prev,
              mkLine('', 'output'),
              mkLine(check.message || '', 'success'),
              mkLine('', 'output'),
            ]);
            scrollBottom();
          }, (result.lines.length * 80) + 200);
          updateMissionProgress(
            activeMission.id,
            check.newStage ?? um.current_stage,
            check.missionComplete ? 'completed' : 'in_progress'
          );
        }
      }
    }

    if (result.lines.length > 0) {
      streamLines(
        result.lines.map(l => l.text),
        result.lines[0]?.type || 'output',
        result.delay ? Math.min(result.delay / result.lines.length, 120) : 25,
        result.delay ? 100 : 0
      );
    }
  }, [
    user, currentDir, connectedTarget, aiMode, matrixMode,
    activeMission, userMissions, updateMissionProgress,
    setCurrentDir, setConnectedTarget, setMatrixMode, setGlitchActive,
    streamLines, router,
  ]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !busy) {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : history[next] || '');
    } else if (e.key === 'Escape' && matrixMode) {
      setMatrixMode(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      const cmds = ['help','scan','connect','disconnect','breach','decrypt','trace','inject','bypass','whoami','status','clear','ls','cd','cat','sudo','matrix','logs','missions','ai','ping','nmap','uname','uptime','ifconfig','ps','exit'];
      const match = cmds.find(c => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
  };

  const prompt = `${user?.handle || 'ghost'}@null:${currentDir}${connectedTarget ? ` [${connectedTarget}]` : ''}$ `;
  const promptColor = connectedTarget ? '#00f5ff' : '#00ff41';

  const lineTypeColor: Record<TerminalLine['type'], string> = {
    input:   '#ffffff',
    output:  'rgba(0,255,65,0.85)',
    error:   '#ff0040',
    success: '#00ff41',
    warning: '#ff8c00',
    system:  '#00f5ff',
    info:    '#666',
  };

  return (
    <div
      className="flex flex-col h-full bg-black/80 font-mono text-sm relative"
      style={{ fontSize: `${settings.terminal_font_size}px` }}
      onClick={() => inputRef.current?.focus()}
    >
      {}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 space-y-px"
        style={{ minHeight: 0 }}
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.08 }}
              className="terminal-output-line whitespace-pre-wrap break-all leading-5"
              style={{ color: lineTypeColor[line.type] }}
              dangerouslySetInnerHTML={{ __html: (line.text?.replace(/\x1b\[(\d+)m/g, '') || '') || '&nbsp;' }}
            />
          ))}
        </AnimatePresence>
        {busy && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-neon-green align-middle ml-1"
          />
        )}
      </div>

      {}
      <div className="flex items-center px-4 py-2 border-t border-neon-green/20 bg-black/40">
        <span style={{ color: promptColor, textShadow: `0 0 6px ${promptColor}` }} className="whitespace-nowrap mr-1 text-xs">
          {prompt}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          className="flex-1 bg-transparent outline-none text-white caret-neon-green border-none text-xs font-mono"
          style={{ caretColor: '#00ff41' }}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        {busy && (
          <span className="text-neon-green/50 text-xs ml-2 animate-pulse">PROCESSING…</span>
        )}
      </div>
    </div>
  );
}
