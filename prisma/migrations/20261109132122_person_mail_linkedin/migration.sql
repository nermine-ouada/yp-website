/*
  Warnings:

  - You are about to drop the column `facebook` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" RENAME COLUMN "facebook" TO "mail";
ALTER TABLE "Person" ADD COLUMN "linkedin" TEXT;
