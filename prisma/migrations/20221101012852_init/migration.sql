-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `first_option` VARCHAR(191) NOT NULL,
    `secont_option` VARCHAR(191) NOT NULL,
    `first_option_chosen_count` INTEGER NOT NULL DEFAULT 0,
    `second_option_chosen_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
