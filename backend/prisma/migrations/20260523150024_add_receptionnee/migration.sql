/*
  Warnings:

  - You are about to drop the column `name` on the `Utilisateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mot_de_passe` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EtatEquipement" AS ENUM ('NEUF', 'BON_ETAT', 'EN_PANNE', 'EN_MAINTENANCE', 'REFORME');

-- CreateEnum
CREATE TYPE "TypeDemande" AS ENUM ('ACHAT', 'REMPLACEMENT', 'REFORME', 'EQUIPEMENT', 'SALLE', 'SIGNALEMENT');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REFUSEE', 'RECEPTIONNE');

-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('ENTREE', 'SORTIE', 'TRANSFERT');

-- AlterTable
CREATE SEQUENCE utilisateur_id_seq;
ALTER TABLE "Utilisateur" DROP COLUMN "name",
ADD COLUMN     "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "mot_de_passe" TEXT NOT NULL,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "prenom" TEXT NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD COLUMN     "telephone" TEXT,
ALTER COLUMN "id" SET DEFAULT nextval('utilisateur_id_seq');
ALTER SEQUENCE utilisateur_id_seq OWNED BY "Utilisateur"."id";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratoire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "responsable_id" INTEGER,

    CONSTRAINT "Laboratoire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipement" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "etat" "EtatEquipement" NOT NULL DEFAULT 'NEUF',
    "quantite" INTEGER NOT NULL,
    "prix" DECIMAL(10,2),
    "localisation" TEXT,
    "date_acquisition" TIMESTAMP(3),
    "laboratoire_id" INTEGER,

    CONSTRAINT "Equipement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demande" (
    "id" SERIAL NOT NULL,
    "type" "TypeDemande" NOT NULL,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "motif" TEXT,
    "date_demande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "demandeur_id" INTEGER NOT NULL,
    "equipement_id" INTEGER,
    "valideur_id" INTEGER,

    CONSTRAINT "Demande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mouvement" (
    "id" SERIAL NOT NULL,
    "type" "TypeMouvement" NOT NULL,
    "quantite" INTEGER NOT NULL,
    "motif" TEXT,
    "date_mouvement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipement_id" INTEGER NOT NULL,
    "magasinier_id" INTEGER NOT NULL,
    "laboratoire_id" INTEGER,

    CONSTRAINT "Mouvement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signalement" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipement_id" INTEGER NOT NULL,
    "professeur_id" INTEGER NOT NULL,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nom_key" ON "Role"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratoire_code_key" ON "Laboratoire"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratoire_responsable_id_key" ON "Laboratoire"("responsable_id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipement_reference_key" ON "Equipement"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratoire" ADD CONSTRAINT "Laboratoire_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipement" ADD CONSTRAINT "Equipement_laboratoire_id_fkey" FOREIGN KEY ("laboratoire_id") REFERENCES "Laboratoire"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_demandeur_id_fkey" FOREIGN KEY ("demandeur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_equipement_id_fkey" FOREIGN KEY ("equipement_id") REFERENCES "Equipement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_valideur_id_fkey" FOREIGN KEY ("valideur_id") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_equipement_id_fkey" FOREIGN KEY ("equipement_id") REFERENCES "Equipement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_magasinier_id_fkey" FOREIGN KEY ("magasinier_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_laboratoire_id_fkey" FOREIGN KEY ("laboratoire_id") REFERENCES "Laboratoire"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_equipement_id_fkey" FOREIGN KEY ("equipement_id") REFERENCES "Equipement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
