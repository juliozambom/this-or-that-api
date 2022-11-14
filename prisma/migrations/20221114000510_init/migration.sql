/*
  Warnings:

  - Added the required column `is_validated` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questions` ADD COLUMN `is_validated` BOOLEAN NOT NULL;
