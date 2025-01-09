/*
  Warnings:

  - Added the required column `sharedWithId` to the `SharedLease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "SharedLease" ADD COLUMN     "sharedWithId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLease" ADD CONSTRAINT "SharedLease_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
