import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

// Carrega .env.local manualmente para garantir compatibilidade com drizzle-kit CLI
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      // Procura por DATABASE_URL excluindo comentários ou espaços
      const match = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\n\r]+)["']?/m);
      if (match) {
        databaseUrl = match[1].trim();
      }
    }
  } catch (e) {
    console.error("Erro ao ler o arquivo .env.local no drizzle.config:", e);
  }
}

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
