-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "failedAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AdminUser" ADD COLUMN "lockedUntil" TIMESTAMP(3);
