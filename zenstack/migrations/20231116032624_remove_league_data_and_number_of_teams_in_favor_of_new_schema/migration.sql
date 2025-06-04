/*
  Warnings:

  - You are about to drop the column `data` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfTeams` on the `League` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "League" DROP COLUMN "data",
DROP COLUMN "numberOfTeams";
