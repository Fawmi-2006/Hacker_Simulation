

export interface User {
  id: number;
  username: string;
  handle: string;
  level: number;
  xp: number;
  rep: number;
  theme: string;
}

export interface Settings {
  sound_enabled: boolean;
  crt_effect: boolean;
  scanlines: boolean;
  animation_intensity: 'low' | 'medium' | 'high';
  terminal_font_size: number;
  theme_color: ThemeColor;
  ambient_volume: number;
}

export type ThemeColor = 'green' | 'cyan' | 'purple' | 'red' | 'blue' | 'orange';

export const THEME_COLORS: Record<ThemeColor, { primary: string; glow: string; hex: string }> = {
  green:  { primary: 'text-neon-green',  glow: 'shadow-neon-green',  hex: '#00ff41' },
  cyan:   { primary: 'text-neon-cyan',   glow: 'shadow-neon-cyan',   hex: '#00f5ff' },
  purple: { primary: 'text-neon-purple', glow: 'shadow-neon-purple', hex: '#bf00ff' },
  red:    { primary: 'text-neon-red',    glow: 'shadow-neon-red',    hex: '#ff0040' },
  blue:   { primary: 'text-neon-blue',   glow: 'shadow-neon-blue',   hex: '#0080ff' },
  orange: { primary: 'text-neon-orange', glow: 'shadow-neon-orange', hex: '#ff8c00' },
};

export interface Mission {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
  category: string;
  xp_reward: number;
  rep_reward: number;
  lore: string;
  is_locked: boolean;
  unlock_level: number;
  sort_order: number;
  stages?: MissionStage[];
}

export interface MissionStage {
  id: number;
  mission_id: number;
  stage_number: number;
  title: string;
  objective: string;
  hint: string;
  trigger_cmd: string;
}

export interface UserMission {
  mission_id: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  current_stage: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface FilesystemNode {
  id: number;
  path: string;
  name: string;
  type: 'dir' | 'file';
  content?: string;
  permissions: string;
  owner: string;
  size_bytes: number;
  is_hidden: boolean;
  is_locked: boolean;
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'warning' | 'system' | 'info';
  delay?: number;
}

export interface AIMessage {
  role: 'user' | 'ai';
  message: string;
  created_at?: string;
}

export interface CryptoWallet {
  currency: string;
  address: string;
  balance: number;
}

export interface DarknetListing {
  id: number;
  title: string;
  description: string;
  price_btc: number;
  vendor: string;
  category: string;
}

export interface SystemEvent {
  event_type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}

export interface FakeTarget {
  ip: string;
  hostname: string;
  os: string;
  ports: number[];
  status: 'active' | 'offline' | 'compromised';
  threat: number;
}

export interface NetworkPacket {
  id: string;
  src: string;
  dst: string;
  protocol: string;
  size: number;
  timestamp: number;
  flagged: boolean;
}
