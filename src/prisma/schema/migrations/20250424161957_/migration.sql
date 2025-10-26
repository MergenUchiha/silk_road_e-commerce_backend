/*
  Warnings:

  - Added the required column `views` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "views" INTEGER NOT NULL;
