import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import type { Mission, UserMission } from '@/types';

export async function GET(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const missions = await query<Mission>(`
      SELECT m.*, ms.id as stage_id, ms.stage_number, ms.title as stage_title,
             ms.objective, ms.hint, ms.trigger_cmd
      FROM missions m
      LEFT JOIN mission_stages ms ON ms.mission_id = m.id
      ORDER BY m.id, ms.stage_number
    `);

    const missionMap = new Map<number, Mission>();
    for (const row of missions as any[]) {
      if (!missionMap.has(row.id)) {
        missionMap.set(row.id, {
          id: row.id, slug: row.slug, title: row.title,
          description: row.description, difficulty: row.difficulty,
          category: row.category, xp_reward: row.xp_reward,
          rep_reward: row.rep_reward, lore: row.lore,
          is_locked: row.is_locked, unlock_level: row.unlock_level,
          stages: [],
        });
      }
      if (row.stage_id) {
        missionMap.get(row.id)!.stages!.push({
          id: row.stage_id, mission_id: row.id,
          stage_number: row.stage_number, title: row.stage_title,
          objective: row.objective, hint: row.hint,
          trigger_cmd: row.trigger_cmd,
        });
      }
    }

    const userMissions = await query<UserMission>(
      'SELECT * FROM user_missions WHERE user_id = ?',
      [payload.userId]
    );

    return NextResponse.json({
      missions: Array.from(missionMap.values()),
      userMissions,
    });
  } catch (err) {
    console.error('Missions fetch error:', err);
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
