
import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306'),
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'hacker_sim',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query<T = unknown>(sql: string, values?: unknown[]): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, values);
  return rows as T[];
}

export async function execute(sql: string, values?: unknown[]): Promise<ResultSetHeader> {
  const pool = getPool();
  const [result] = await pool.execute(sql, values);
  return result as ResultSetHeader;
}

export async function queryOne<T = unknown>(sql: string, values?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, values);
  return rows[0] ?? null;
}
