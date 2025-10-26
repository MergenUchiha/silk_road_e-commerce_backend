/*
  Warnings:

  - You are about to drop the column `admin_id` on the `tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- DropIndex
DROP INDEX "tokens_admin_id_key";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "admin_id";
