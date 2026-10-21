import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "path";

// prisma.config.ts bypasses Prisma's automatic .env loading,
// so we load it manually here.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: false });

export default defineConfig({
  datasource: {
    // Migrations/CLI use DIRECT_URL (Supabase session pooler, IPv4) instead
    // of DATABASE_URL (transaction pooler) — migrations need DDL support
    // transaction-mode pgbouncer doesn't reliably provide. See DEPLOY.md.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
