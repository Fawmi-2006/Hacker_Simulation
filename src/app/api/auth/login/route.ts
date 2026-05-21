import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    if (username.length > 64 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const user = await validateCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken(user.id, user.username);
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
