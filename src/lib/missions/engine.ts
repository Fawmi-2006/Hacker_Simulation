
import type { Mission, UserMission, MissionStage } from '@/types';

export interface MissionCheckResult {
  stageComplete: boolean;
  missionComplete: boolean;
  newStage?: number;
  message?: string;
}

export function checkCommandAgainstMission(
  command: string,
  mission: Mission,
  userMission: UserMission
): MissionCheckResult {
  const stages = mission.stages || [];
  const currentStageNum = userMission.current_stage;
  const currentStage = stages.find(s => s.stage_number === currentStageNum + 1);

  if (!currentStage) return { stageComplete: false, missionComplete: false };

  const cmd = command.trim().split(/\s+/)[0].toLowerCase();
  const triggerCmd = (currentStage.trigger_cmd || '').toLowerCase();

  if (cmd !== triggerCmd && !command.toLowerCase().includes(triggerCmd)) {
    return { stageComplete: false, missionComplete: false };
  }

  const newStage = currentStageNum + 1;
  const isLast = newStage >= stages.length;

  return {
    stageComplete: true,
    missionComplete: isLast,
    newStage,
    message: isLast
      ? `✦ MISSION COMPLETE: ${mission.title} ✦`
      : `✓ Stage ${newStage} complete: ${currentStage.title}`,
  };
}

export function getMissionDifficultyColor(difficulty: Mission['difficulty']): string {
  switch (difficulty) {
    case 'EASY':    return 'text-neon-green';
    case 'MEDIUM':  return 'text-neon-yellow';
    case 'HARD':    return 'text-neon-orange';
    case 'EXTREME': return 'text-neon-red';
    default:        return 'text-gray-400';
  }
}

export function getMissionStatusColor(status: UserMission['status']): string {
  switch (status) {
    case 'completed':   return 'text-neon-green';
    case 'in_progress': return 'text-neon-cyan';
    case 'available':   return 'text-gray-300';
    case 'locked':      return 'text-gray-600';
    default:            return 'text-gray-400';
  }
}
