/*
  Warnings:

  - Made the column `aaa` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "aaa" SET NOT NULL;
