import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai/assistant';

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const response = generateAIResponse(message);
    return NextResponse.json({ message: response });
  } catch (err) {
    console.error('AI route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
