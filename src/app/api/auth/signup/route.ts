import { NextRequest, NextResponse } from 'next/server';
import { registerUser, validateSignupInput, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body as {
      username?: string;
      email?: string;
      password?: string;
    };

    const validationError = validateSignupInput(
      username ?? '',
      email    ?? '',
      password ?? ''
    );
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const user = await registerUser(username!, email!, password!);
    const token = signToken(user.id, user.username);

    return NextResponse.json({ token, user }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'CONFLICT') {
      const field = (err as Error & { field?: string }).field ?? 'username';
      const msg   = field === 'email'
        ? 'Email already registered'
        : 'Username already taken';
      return NextResponse.json({ error: msg, field }, { status: 409 });
    }
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
