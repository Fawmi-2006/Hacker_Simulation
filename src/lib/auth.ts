
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { query, queryOne, execute } from './db';
import type { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'ghost_null_secret_change_in_prod';
const JWT_EXPIRES = '24h';

export interface AuthPayload {
  userId: number;
  username: string;
}

export async function validateCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const row = await queryOne<{ id: number; username: string; password: string; handle: string; level: number; xp: number; rep: number; theme: string }>(
    'SELECT id, username, password, handle, level, xp, rep, theme FROM users WHERE username = ?',
    [username]
  );
  if (!row) return null;

  const match = await bcrypt.compare(password, row.password);
  if (!match) return null;

  await query('UPDATE users SET last_login = NOW() WHERE id = ?', [row.id]);

  return {
    id: row.id,
    username: row.username,
    handle: row.handle,
    level: row.level,
    xp: row.xp,
    rep: row.rep,
    theme: row.theme,
  };
}

export function signToken(userId: number, username: string): string {
  const payload: AuthPayload = { userId, username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export function validateSignupInput(
  username: string,
  email: string,
  password: string
): string | null {
  if (!username || username.length < 3 || username.length > 32) {
    return 'Username must be 3–32 characters';
  }
  if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
    return 'Username may only contain letters, numbers, _ and -';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email address';
  }
  if (email.length > 255) {
    return 'Email too long';
  }
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (password.length > 128) {
    return 'Password too long';
  }
  return null; 
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<User> {
  
  const conflict = await queryOne<{ field: string }>(
    `SELECT
       CASE
         WHEN username = ? THEN 'username'
         WHEN email    = ? THEN 'email'
       END AS field
     FROM users
     WHERE username = ? OR email = ?
     LIMIT 1`,
    [username, email, username, email]
  );
  if (conflict) {
    throw Object.assign(new Error('CONFLICT'), { field: conflict.field });
  }

  const hash = await bcrypt.hash(password, 12);

  const handle = username; 
  const result = await execute(
    `INSERT INTO users (username, email, password, handle, level, xp, rep, theme)
     VALUES (?, ?, ?, ?, 1, 0, 0, 'green')`,
    [username, email, hash, handle]
  );
  const userId = result.insertId;

  await execute(
    `INSERT INTO settings (user_id, sound_enabled, crt_effect, scanlines,
       animation_intensity, terminal_font_size, theme_color, ambient_volume)
     VALUES (?, 1, 1, 1, 'high', 14, 'green', 40)`,
    [userId]
  );

  return { id: userId, username, handle, level: 1, xp: 0, rep: 0, theme: 'green' };
}
