/*
  Warnings:

  - You are about to drop the column `aa` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "aa",
ALTER COLUMN "password" DROP NOT NULL;
