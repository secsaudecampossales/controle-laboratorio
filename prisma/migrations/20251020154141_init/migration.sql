-- CreateEnum
CREATE TYPE "TipoExame" AS ENUM ('BETA_HCG', 'DENGUE', 'CHIKUNGUNYA', 'ZIKA', 'COVID', 'PPD', 'INGRAM', 'CHAGAS', 'BACILOSCOPIA_ESCARRO');

-- CreateEnum
CREATE TYPE "StatusExame" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "nascimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exames" (
    "id" TEXT NOT NULL,
    "tipo" "TipoExame" NOT NULL,
    "resultado" TEXT,
    "observacoes" TEXT,
    "dataExame" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataResultado" TIMESTAMP(3),
    "status" "StatusExame" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pacienteId" TEXT NOT NULL,

    CONSTRAINT "exames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
