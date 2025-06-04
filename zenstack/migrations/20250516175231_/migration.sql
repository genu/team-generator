/*
  Warnings:

  - Made the column `configuration` on table `League` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "League" ALTER COLUMN "configuration" SET NOT NULL;
