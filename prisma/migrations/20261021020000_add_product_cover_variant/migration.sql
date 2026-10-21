-- AlterTable
ALTER TABLE "Product" ADD COLUMN "coverVariantId" TEXT;

-- CreateIndex
CREATE INDEX "Product_coverVariantId_idx" ON "Product"("coverVariantId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_coverVariantId_fkey" FOREIGN KEY ("coverVariantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
