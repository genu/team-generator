-- CreateEnum
CREATE TYPE "ShirtColor" AS ENUM ('Black', 'White', 'Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'Gray');

-- CreateTable
CREATE TABLE "ThisIsATest" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ThisIsATest_pkey" PRIMARY KEY ("id")
);
