-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `pseudo` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,
    `estVerifie` BOOLEAN NOT NULL DEFAULT false,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `majLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    UNIQUE INDEX `Utilisateur_pseudo_key`(`pseudo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `joueurXId` INTEGER NULL,
    `joueurOId` INTEGER NULL,
    `grille` VARCHAR(191) NOT NULL DEFAULT '_________',
    `joueurCourant` VARCHAR(191) NOT NULL DEFAULT 'X',
    `gagnantId` INTEGER NULL,
    `estNulle` BOOLEAN NOT NULL DEFAULT false,
    `typePartie` VARCHAR(191) NOT NULL,
    `niveauIA` VARCHAR(191) NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `majLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Partie_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `valeur` VARCHAR(191) NOT NULL,
    `utilisateurId` INTEGER NOT NULL,
    `expireLe` DATETIME(3) NOT NULL,
    `utilise` BOOLEAN NOT NULL DEFAULT false,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Token_valeur_key`(`valeur`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Partie` ADD CONSTRAINT `Partie_joueurXId_fkey` FOREIGN KEY (`joueurXId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partie` ADD CONSTRAINT `Partie_joueurOId_fkey` FOREIGN KEY (`joueurOId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partie` ADD CONSTRAINT `Partie_gagnantId_fkey` FOREIGN KEY (`gagnantId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
