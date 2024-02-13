/*
  Warnings:

  - Made the column `recipientId` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipientId_fkey";

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "recipientId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
