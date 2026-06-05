/*
  Warnings:

  - The values [RECEPTIONNE] on the enum `StatutDemande` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatutDemande_new" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REFUSEE', 'RECEPTIONNEE');
ALTER TABLE "public"."Demande" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Demande" ALTER COLUMN "statut" TYPE "StatutDemande_new" USING ("statut"::text::"StatutDemande_new");
ALTER TYPE "StatutDemande" RENAME TO "StatutDemande_old";
ALTER TYPE "StatutDemande_new" RENAME TO "StatutDemande";
DROP TYPE "public"."StatutDemande_old";
ALTER TABLE "Demande" ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';
COMMIT;
