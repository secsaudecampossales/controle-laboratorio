-- AlterEnum
ALTER TYPE "TipoExame" ADD VALUE 'OUTROS';

-- AlterTable
ALTER TABLE "exames" ADD COLUMN     "tipoCustom" TEXT;
