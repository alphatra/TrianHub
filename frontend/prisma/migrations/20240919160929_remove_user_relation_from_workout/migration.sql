-- DropForeignKey
ALTER TABLE `Workout` DROP FOREIGN KEY `Workout_userId_fkey`;

-- AlterTable
ALTER TABLE `Workout` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Workout` ADD CONSTRAINT `Workout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
