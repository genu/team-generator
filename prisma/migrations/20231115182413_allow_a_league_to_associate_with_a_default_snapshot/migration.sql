/*
  Warnings:

  - A unique constraint covering the columns `[defaultSnapshotId]` on the table `League` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "defaultSnapshotId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "League_defaultSnapshotId_key" ON "League"("defaultSnapshotId");

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_defaultSnapshotId_fkey" FOREIGN KEY ("defaultSnapshotId") REFERENCES "Snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
