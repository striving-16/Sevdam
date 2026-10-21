import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "path";

// prisma.config.ts bypasses Prisma's automatic .env loading,
// so we load it manually here.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: false });

export default defineConfig({
  datasource: {
    // Migrations/CLI use the direct (non-pooled) connection — the pooler's
    // session-mode pool_size is small and shared with runtime traffic.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
