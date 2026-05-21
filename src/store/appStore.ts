'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Settings, Mission, UserMission, ThemeColor } from '@/types';

interface AppState {
  
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  currentDir: string;
  connectedTarget: string | null;
  terminalTheme: string;
  setCurrentDir: (dir: string) => void;
  setConnectedTarget: (target: string | null) => void;

  missions: Mission[];
  userMissions: UserMission[];
  activeMission: Mission | null;
  setMissions: (missions: Mission[]) => void;
  setUserMissions: (um: UserMission[]) => void;
  setActiveMission: (mission: Mission | null) => void;
  updateMissionProgress: (missionId: number, stage: number, status: UserMission['status']) => void;

  sidebarCollapsed: boolean;
  matrixMode: boolean;
  glitchActive: boolean;
  threatLevel: number;
  setSidebarCollapsed: (v: boolean) => void;
  setMatrixMode: (v: boolean) => void;
  setGlitchActive: (v: boolean) => void;
  setThreatLevel: (v: number) => void;

  soundEnabled: boolean;
  ambientPlaying: boolean;
  setSoundEnabled: (v: boolean) => void;
  setAmbientPlaying: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      settings: {
        sound_enabled: true,
        crt_effect: true,
        scanlines: true,
        animation_intensity: 'high',
        terminal_font_size: 14,
        theme_color: 'green' as ThemeColor,
        ambient_volume: 40,
      },
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      currentDir: '/home/ghost',
      connectedTarget: null,
      terminalTheme: 'default',
      setCurrentDir: (dir) => set({ currentDir: dir }),
      setConnectedTarget: (target) => set({ connectedTarget: target }),

      missions: [],
      userMissions: [],
      activeMission: null,
      setMissions: (missions) => set({ missions }),
      setUserMissions: (userMissions) => set({ userMissions }),
      setActiveMission: (activeMission) => set({ activeMission }),
      updateMissionProgress: (missionId, stage, status) =>
        set((state) => ({
          userMissions: state.userMissions.map((um) =>
            um.mission_id === missionId
              ? { ...um, current_stage: stage, status }
              : um
          ),
        })),

      sidebarCollapsed: false,
      matrixMode: false,
      glitchActive: false,
      threatLevel: 2,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setMatrixMode: (v) => set({ matrixMode: v }),
      setGlitchActive: (v) => set({ glitchActive: v }),
      setThreatLevel: (v) => set({ threatLevel: v }),

      soundEnabled: true,
      ambientPlaying: false,
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setAmbientPlaying: (v) => set({ ambientPlaying: v }),
    }),
    {
      name: 'hacker-sim-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
