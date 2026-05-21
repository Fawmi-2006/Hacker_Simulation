import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import type { Settings } from '@/types';

export async function GET(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const settings = await queryOne<Settings>(
      'SELECT * FROM settings WHERE user_id = ?',
      [payload.userId]
    );
    return NextResponse.json({ settings: settings ?? null });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const body = await req.json() as Partial<Settings>;
    const allowed: (keyof Settings)[] = [
      'sound_enabled', 'crt_effect', 'scanlines',
      'animation_intensity', 'terminal_font_size',
      'theme_color', 'ambient_volume',
    ];

    const updates: string[] = [];
    const values: unknown[] = [];
    for (const key of allowed) {
      if (key in body) {
        updates.push(`${key} = ?`);
        values.push(body[key]);
      }
    }
    if (!updates.length) return NextResponse.json({ ok: true });

    values.push(payload.userId);
    await query(
      `UPDATE settings SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
