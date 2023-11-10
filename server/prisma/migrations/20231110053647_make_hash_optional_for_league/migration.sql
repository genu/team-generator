-- DropIndex
DROP INDEX "League_hash_key";

-- AlterTable
ALTER TABLE "League" ALTER COLUMN "hash" DROP NOT NULL;
