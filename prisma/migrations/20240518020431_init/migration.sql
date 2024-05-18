-- CreateTable
CREATE TABLE `historico` (
    `id` INTEGER NOT NULL,
    `numero` INTEGER NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `horaMinuto` DATETIME(3) NOT NULL,
    `dia` DATETIME(3) NOT NULL,
    `apostasnoVermelho` DOUBLE NOT NULL,
    `apostasnoBranco` DOUBLE NOT NULL,
    `apostanoPreto` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
