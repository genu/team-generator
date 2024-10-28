-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_leagueId_fkey";

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
