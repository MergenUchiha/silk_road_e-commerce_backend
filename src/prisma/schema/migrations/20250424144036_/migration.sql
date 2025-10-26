/*
  Warnings:

  - Added the required column `city_district` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "city_district" TEXT NOT NULL;
