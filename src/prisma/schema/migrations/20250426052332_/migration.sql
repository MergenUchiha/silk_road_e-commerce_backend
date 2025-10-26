/*
  Warnings:

  - Changed the type of `expired_date` on the `advertisement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "advertisement" DROP COLUMN "expired_date",
ADD COLUMN     "expired_date" VARCHAR(25) NOT NULL;
