-- DropForeignKey
ALTER TABLE `WorkoutExercise` DROP FOREIGN KEY `WorkoutExercise_workoutSectionId_fkey`;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutSectionId_fkey` FOREIGN KEY (`workoutSectionId`) REFERENCES `WorkoutSection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
