import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { command, output, directory } = await req.json();
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Missing command' }, { status: 400 });
    }

    await query(
      `INSERT INTO terminal_logs (user_id, command, output, directory)
       VALUES (?, ?, ?, ?)`,
      [payload.userId, command.slice(0, 500), (output ?? '').slice(0, 2000), (directory ?? '/').slice(0, 200)]
    );
    return NextResponse.json({ ok: true });
  } catch {
    
    return NextResponse.json({ ok: true });
  }
}
