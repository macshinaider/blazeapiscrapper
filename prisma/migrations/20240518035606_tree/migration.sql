/*
  Warnings:

  - You are about to alter the column `apostasnoVermelho` on the `historico` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `apostasnoBranco` on the `historico` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `apostanoPreto` on the `historico` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `historico` MODIFY `apostasnoVermelho` VARCHAR(191) NULL,
    MODIFY `apostasnoBranco` VARCHAR(191) NULL,
    MODIFY `apostanoPreto` VARCHAR(191) NULL;
