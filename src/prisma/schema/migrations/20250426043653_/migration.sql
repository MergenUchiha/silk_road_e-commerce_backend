/*
  Warnings:

  - Added the required column `description` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "advertisement" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "expired_date" DATE NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advertisement_product_id_key" ON "advertisement"("product_id");

-- AddForeignKey
ALTER TABLE "advertisement" ADD CONSTRAINT "advertisement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
