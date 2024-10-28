-- DropForeignKey
ALTER TABLE "League" DROP CONSTRAINT "League_accountId_fkey";

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
