/*
  Warnings:

  - You are about to drop the column `hash` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_hash_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "hash";
