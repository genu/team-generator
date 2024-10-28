-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_leagueId_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
