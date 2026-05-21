'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import GlitchText from '@/components/ui/GlitchText';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';
import { getMissionDifficultyColor } from '@/lib/missions/engine';
import type { Mission, UserMission } from '@/types';
import { Lock, Play, CheckCircle, Clock, ChevronRight } from 'lucide-react';

function MissionCard({ mission, userMission, onSelect }: {
  mission: Mission;
  userMission?: UserMission;
  onSelect: () => void;
}) {
  const status = userMission?.status ?? 'locked';
  const isLocked = status === 'locked';
  const isComplete = status === 'completed';
  const isActive = status === 'in_progress';

  const statusIcon = {
    locked:      <Lock size={14} className="text-gray-600" />,
    available:   <Play size={14} className="text-neon-green" />,
    in_progress: <Clock size={14} className="text-neon-cyan" />,
    completed:   <CheckCircle size={14} className="text-neon-green" />,
  }[status];

  const diffColor = getMissionDifficultyColor(mission.difficulty);

  return (
    <motion.div
      whileHover={!isLocked ? { x: 4, scale: 1.01 } : {}}
      onClick={!isLocked ? onSelect : undefined}
      className={`glass-panel p-4 cursor-${isLocked ? 'not-allowed' : 'pointer'} relative overflow-hidden
        border transition-all duration-200
        ${isActive   ? 'border-neon-cyan/40' : ''}
        ${isComplete ? 'border-neon-green/30' : ''}
        ${isLocked   ? 'opacity-50' : 'hover:border-neon-green/40'}
      `}
    >
      {}
      {isActive && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-cyan animate-pulse"
          style={{ boxShadow: '0 0 6px #00f5ff' }} />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {statusIcon}
            <h3 className={`font-cyber text-sm font-bold ${isLocked ? 'text-gray-600' : 'text-neon-green'}`}>
              {mission.title}
            </h3>
          </div>
          <p className="text-gray-500 text-xs leading-4 mb-2 line-clamp-2">{mission.description}</p>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className={diffColor}>{mission.difficulty}</span>
            <span className="text-gray-600">{mission.category.toUpperCase()}</span>
            <span className="text-neon-green/60">+{mission.xp_reward} XP</span>
            <span className="text-neon-cyan/60">+{mission.rep_reward} REP</span>
          </div>
          {isActive && userMission && (mission.stages?.length ?? 0) > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                <span>PROGRESS</span>
                <span>{userMission.current_stage}/{mission.stages?.length ?? 4}</span>
              </div>
              <div className="cyber-progress">
                <div
                  className="cyber-progress-bar"
                  style={{ width: `${(userMission.current_stage / (mission.stages?.length ?? 4)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {!isLocked && <ChevronRight size={16} className="text-gray-600 flex-shrink-0 mt-1" />}
      </div>
    </motion.div>
  );
}

export default function MissionsPage() {
  const router = useRouter();
  const { missions, userMissions, setMissions, setUserMissions, setActiveMission, updateMissionProgress, user } = useAppStore();
  const [selected, setSelected] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const token = (() => {
      try { return JSON.parse(localStorage.getItem('hacker-sim-store') || '{}').state?.token; } catch { return ''; }
    })();
    fetch('/api/missions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.missions) { setMissions(d.missions); setUserMissions(d.userMissions || []); } })
      .catch(() => {});
  }, [setMissions, setUserMissions]);

  const handleStart = async (mission: Mission) => {
    setLoading(true);
    const token = (() => {
      try { return JSON.parse(localStorage.getItem('hacker-sim-store') || '{}').state?.token; } catch { return ''; }
    })();
    await fetch('/api/missions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ missionId: mission.id }),
    }).catch(() => {});
    updateMissionProgress(mission.id, 0, 'in_progress');
    setActiveMission(mission);
    setLoading(false);
    router.push('/terminal');
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div>
        <GlitchText text="MISSION BOARD" size="xl" className="text-neon-green block" />
        <p className="text-gray-600 text-xs font-mono mt-0.5">
          SELECT OPERATION · {userMissions.filter(m => m.status === 'completed').length} COMPLETED
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {missions.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            userMission={userMissions.find(u => u.mission_id === mission.id)}
            onSelect={() => setSelected(mission)}
          />
        ))}
        {missions.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-700 font-mono text-sm">
            <p>No missions loaded.</p>
            <p className="text-xs mt-1">Configure database and run seeds.</p>
          </div>
        )}
      </div>

      {}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel max-w-lg w-full p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <GlitchText text={selected.title} size="lg" className="text-neon-green" />
                  <p className={`text-xs font-mono mt-1 ${getMissionDifficultyColor(selected.difficulty)}`}>
                    {selected.difficulty} · {selected.category.toUpperCase()}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-neon-red text-lg leading-none">×</button>
              </div>

              <p className="text-gray-400 text-sm leading-5">{selected.description}</p>

              <div className="bg-black/40 border border-neon-green/10 p-3 text-xs font-mono text-gray-500 leading-5 italic">
                "{selected.lore}"
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-neon-green">+{selected.xp_reward} XP</span>
                <span className="text-neon-cyan">+{selected.rep_reward} REP</span>
                <span className="text-gray-600">{selected.stages?.length ?? 4} STAGES</span>
              </div>

              {selected.stages && selected.stages.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-600 tracking-widest">OBJECTIVES:</p>
                  {selected.stages.map(s => (
                    <div key={s.id} className="flex items-start gap-2 text-xs font-mono text-gray-500">
                      <span className="text-neon-cyan mt-0.5">0{s.stage_number}</span>
                      <span>{s.objective}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <NeonButton
                  onClick={() => { handleStart(selected); setSelected(null); }}
                  loading={loading}
                  className="flex-1 justify-center"
                  icon={<Play size={14} />}
                >
                  LAUNCH MISSION
                </NeonButton>
                <NeonButton color="red" onClick={() => setSelected(null)}>
                  ABORT
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
