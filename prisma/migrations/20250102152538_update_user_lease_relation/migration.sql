/*
  Warnings:

  - You are about to drop the column `userId` on the `Lease` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_userId_fkey";

-- AlterTable
ALTER TABLE "Lease" DROP COLUMN "userId";
