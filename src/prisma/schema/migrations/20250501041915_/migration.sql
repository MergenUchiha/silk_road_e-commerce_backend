/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `shop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shop_user_id_key" ON "shop"("user_id");

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
