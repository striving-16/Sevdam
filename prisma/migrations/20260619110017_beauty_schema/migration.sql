-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SKINCARE', 'HAIRCARE', 'TREATMENT', 'KOREAN_BEAUTY', 'COSMETICS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "benefits" TEXT,
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'SKINCARE',
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "isBestseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "usage" TEXT;

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
