-- Rename name → name_en, description → description_en
ALTER TABLE "Product" RENAME COLUMN "name" TO "name_en";
ALTER TABLE "Product" RENAME COLUMN "description" TO "description_en";

-- Add Arabic fields
ALTER TABLE "Product" ADD COLUMN "name_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "description_ar" TEXT NOT NULL DEFAULT '';

-- Rebuild ProductCategory enum with new values
-- (safe because DB has no products at this point)
ALTER TABLE "Product" DROP COLUMN "category";
DROP TYPE "ProductCategory";
CREATE TYPE "ProductCategory" AS ENUM ('SKINCARE', 'HAIRCARE', 'PERFUMES', 'MAKEUP', 'BODYCARE', 'MENCARE', 'BABYCARE', 'TOOLS');
ALTER TABLE "Product" ADD COLUMN "category" "ProductCategory" NOT NULL DEFAULT 'SKINCARE';
