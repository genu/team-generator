/*
  Warnings:

  - Made the column `accountId` on table `League` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "League" ALTER COLUMN "accountId" SET NOT NULL;
