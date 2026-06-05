-- AlterEnum
ALTER TYPE "StatutDemande" ADD VALUE 'AFFECTEE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TypeDemande" ADD VALUE 'EMPRUNT';
ALTER TYPE "TypeDemande" ADD VALUE 'LABORATOIRE';

-- AlterTable
ALTER TABLE "Demande" ADD COLUMN     "laboratoire_id" INTEGER;

-- AlterTable
ALTER TABLE "Signalement" ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE';

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_laboratoire_id_fkey" FOREIGN KEY ("laboratoire_id") REFERENCES "Laboratoire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
