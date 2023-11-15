/*
  Warnings:

  - You are about to drop the column `defaultSnapshotId` on the `League` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "League" DROP CONSTRAINT "League_defaultSnapshotId_fkey";

-- DropIndex
DROP INDEX "League_defaultSnapshotId_key";

-- AlterTable
ALTER TABLE "League" DROP COLUMN "defaultSnapshotId";
