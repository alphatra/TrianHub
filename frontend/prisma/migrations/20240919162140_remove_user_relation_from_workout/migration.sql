/*
  Warnings:

  - You are about to drop the column `userId` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Workout` DROP FOREIGN KEY `Workout_userId_fkey`;

-- AlterTable
ALTER TABLE `Workout` DROP COLUMN `userId`;
