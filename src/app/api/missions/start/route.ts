import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { missionId } = await req.json();
    if (!missionId || typeof missionId !== 'number') {
      return NextResponse.json({ error: 'Invalid missionId' }, { status: 400 });
    }

    await query(
      `INSERT INTO user_missions (user_id, mission_id, status, current_stage)
       VALUES (?, ?, 'in_progress', 0)
       ON DUPLICATE KEY UPDATE status='in_progress', current_stage=0`,
      [payload.userId, missionId]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Mission start error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
