import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL não está configurado nas variáveis de ambiente!");
}

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export * from './schema';
