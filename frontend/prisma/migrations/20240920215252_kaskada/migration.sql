-- DropForeignKey
ALTER TABLE `WorkoutSection` DROP FOREIGN KEY `WorkoutSection_workoutId_fkey`;

-- AddForeignKey
ALTER TABLE `WorkoutSection` ADD CONSTRAINT `WorkoutSection_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
