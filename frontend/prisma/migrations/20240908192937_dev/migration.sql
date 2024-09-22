-- CreateTable
CREATE TABLE `Exercise` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `set` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `silaValue` INTEGER NOT NULL,
    `mobilnoscValue` INTEGER NOT NULL,
    `dynamikaValue` INTEGER NOT NULL,
    `instructions` TEXT NOT NULL,
    `enrichment` TEXT NULL,
    `videoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
