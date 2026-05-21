import { useCallback, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useAppStore } from '@/store/appStore';

const SOUNDS: Record<string, Howl> = {};

function getOrCreate(id: string, src: string, opts?: Partial<{ volume: number; loop: boolean }>) {
  if (!SOUNDS[id]) {
    SOUNDS[id] = new Howl({
      src: [src],
      volume: opts?.volume ?? 0.4,
      loop:   opts?.loop   ?? false,
    });
  }
  return SOUNDS[id];
}

export function useSound() {
  const { soundEnabled, settings } = useAppStore();

  const play = useCallback((id: string) => {
    if (!soundEnabled) return;
    Howler.volume(settings.ambient_volume / 100);

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const configs: Record<string, { freq: number; duration: number; type: OscillatorType; volume: number }> = {
        keypress: { freq: 600,  duration: 0.03, type: 'square',   volume: 0.05 },
        enter:    { freq: 800,  duration: 0.08, type: 'square',   volume: 0.08 },
        error:    { freq: 200,  duration: 0.2,  type: 'sawtooth', volume: 0.1  },
        success:  { freq: 1200, duration: 0.15, type: 'sine',     volume: 0.1  },
        boot:     { freq: 440,  duration: 0.4,  type: 'square',   volume: 0.15 },
        alert:    { freq: 880,  duration: 0.1,  type: 'square',   volume: 0.12 },
        click:    { freq: 700,  duration: 0.04, type: 'square',   volume: 0.06 },
      };

      const cfg = configs[id] ?? configs.keypress;
      osc.type = cfg.type;
      osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
      gain.gain.setValueAtTime(cfg.volume * (settings.ambient_volume / 100), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + cfg.duration);
    } catch {
      
    }
  }, [soundEnabled, settings.ambient_volume]);

  return { play };
}
