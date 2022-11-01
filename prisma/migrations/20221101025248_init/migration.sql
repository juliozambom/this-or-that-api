/*
  Warnings:

  - You are about to drop the column `secont_option` on the `questions` table. All the data in the column will be lost.
  - Added the required column `second_option` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questions` DROP COLUMN `secont_option`,
    ADD COLUMN `second_option` VARCHAR(191) NOT NULL;
