'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import GlitchText from '@/components/ui/GlitchText';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';
import type { ThemeColor, Settings } from '@/types';
import { THEME_COLORS } from '@/types';
import { Save } from 'lucide-react';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-mono text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full border transition-all duration-300 ${
          checked ? 'border-neon-green bg-neon-green/20' : 'border-gray-700 bg-transparent'
        }`}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full ${checked ? 'bg-neon-green' : 'bg-gray-600'}`}
          style={checked ? { boxShadow: '0 0 6px #00ff41' } : {}}
        />
      </button>
    </div>
  );
}

function Slider({ value, onChange, min, max, label, unit }: {
  value: number; onChange: (v: number) => void;
  min: number; max: number; label: string; unit?: string;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono text-gray-400">{label}</span>
        <span className="text-sm font-mono text-neon-green">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-neon-green/20 rounded-full outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-green
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_#00ff41]"
      />
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState<Settings>({ ...settings });

  const update = <K extends keyof Settings>(key: K, val: Settings[K]) => {
    setLocal(prev => ({ ...prev, [key]: val }));
  };

  const save = async () => {
    updateSettings(local);
    const token = (() => {
      try { return JSON.parse(localStorage.getItem('hacker-sim-store') || '{}').state?.token; } catch { return ''; }
    })();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(local),
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <GlitchText text="SYSTEM CONFIG" size="xl" className="text-neon-green block" />
        <p className="text-gray-600 text-xs font-mono mt-0.5">OPERATOR PREFERENCES</p>
      </div>

      {}
      <GlassPanel>
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-3">ACCENT COLOR</h3>
        <div className="flex gap-3 flex-wrap">
          {(Object.entries(THEME_COLORS) as [ThemeColor, typeof THEME_COLORS[ThemeColor]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => update('theme_color', key)}
              className="w-10 h-10 rounded-sm border-2 transition-all duration-200 relative"
              style={{
                backgroundColor: `${cfg.hex}22`,
                borderColor: local.theme_color === key ? cfg.hex : `${cfg.hex}44`,
                boxShadow: local.theme_color === key ? `0 0 12px ${cfg.hex}` : undefined,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono"
                style={{ color: cfg.hex }}>
                {key[0].toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </GlassPanel>

      {}
      <GlassPanel>
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-2">VISUAL EFFECTS</h3>
        <div className="divide-y divide-neon-green/10">
          <Toggle checked={local.crt_effect}  onChange={v => update('crt_effect', v)}  label="CRT Monitor Effect" />
          <Toggle checked={local.scanlines}   onChange={v => update('scanlines', v)}   label="Scanlines Overlay" />
        </div>
        <div className="mt-2 divide-y divide-neon-green/10">
          <div className="py-2">
            <span className="text-sm font-mono text-gray-400">Animation Intensity</span>
            <div className="flex gap-2 mt-2">
              {(['low', 'medium', 'high'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => update('animation_intensity', v)}
                  className={`flex-1 py-1.5 text-xs font-mono uppercase border transition-colors ${
                    local.animation_intensity === v
                      ? 'border-neon-green text-neon-green bg-neon-green/10'
                      : 'border-gray-700 text-gray-600 hover:border-neon-green/40'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      {}
      <GlassPanel>
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-2">AUDIO</h3>
        <div className="divide-y divide-neon-green/10">
          <Toggle checked={local.sound_enabled} onChange={v => update('sound_enabled', v)} label="Sound Effects" />
        </div>
        <Slider
          label="Ambient Volume" unit="%" value={local.ambient_volume}
          onChange={v => update('ambient_volume', v)} min={0} max={100}
        />
      </GlassPanel>

      {}
      <GlassPanel>
        <h3 className="text-xs font-cyber tracking-widest text-gray-500 mb-2">TERMINAL</h3>
        <Slider
          label="Font Size" unit="px" value={local.terminal_font_size}
          onChange={v => update('terminal_font_size', v)} min={10} max={20}
        />
      </GlassPanel>

      {}
      <div className="flex items-center gap-3">
        <NeonButton onClick={save} icon={<Save size={14} />}>
          {saved ? 'SAVED ✓' : 'SAVE CONFIG'}
        </NeonButton>
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-neon-green text-xs font-mono"
          >
            Configuration applied.
          </motion.span>
        )}
      </div>
    </div>
  );
}
