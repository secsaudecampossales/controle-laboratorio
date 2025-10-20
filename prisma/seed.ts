import { PrismaClient, TipoExame, StatusExame } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar pacientes de exemplo
  const paciente1 = await prisma.paciente.create({
    data: {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      rg: '1234567',
      telefone: '(88) 99999-9999',
      endereco: 'Rua das Flores, 123 - Centro - Campos Sales/CE',
      nascimento: new Date('1985-03-15'),
    },
  })

  const paciente2 = await prisma.paciente.create({
    data: {
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      rg: '7654321',
      telefone: '(88) 88888-8888',
      endereco: 'Av. Principal, 456 - Centro - Campos Sales/CE',
      nascimento: new Date('1990-07-22'),
    },
  })

  const paciente3 = await prisma.paciente.create({
    data: {
      nome: 'Pedro Costa',
      cpf: '456.789.123-00',
      rg: '9876543',
      telefone: '(88) 77777-7777',
      endereco: 'Rua da Paz, 789 - Centro - Campos Sales/CE',
      nascimento: new Date('1978-11-08'),
    },
  })

  // Criar exames de exemplo
  await prisma.exame.create({
    data: {
      tipo: TipoExame.BETA_HCG,
      resultado: 'Positivo',
      observacoes: 'Exame realizado conforme protocolo padrão',
      dataExame: new Date('2024-12-15T14:30:00'),
      dataResultado: new Date('2024-12-16T09:15:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente1.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.COVID,
      resultado: 'Negativo',
      observacoes: 'Teste rápido realizado',
      dataExame: new Date('2024-12-14T10:00:00'),
      dataResultado: new Date('2024-12-14T10:30:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente2.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.DENGUE,
      resultado: 'Negativo',
      observacoes: 'Exame realizado durante período de alta incidência',
      dataExame: new Date('2024-12-13T16:00:00'),
      dataResultado: new Date('2024-12-14T11:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente3.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.CHIKUNGUNYA,
      resultado: 'Negativo',
      observacoes: 'Exame preventivo',
      dataExame: new Date('2024-12-12T08:30:00'),
      dataResultado: new Date('2024-12-13T14:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente1.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.ZIKA,
      resultado: 'Negativo',
      observacoes: 'Exame de rotina',
      dataExame: new Date('2024-12-11T13:00:00'),
      dataResultado: new Date('2024-12-12T10:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente2.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.PPD,
      resultado: 'Negativo',
      observacoes: 'Teste tuberculínico realizado',
      dataExame: new Date('2024-12-10T09:00:00'),
      dataResultado: new Date('2024-12-12T16:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente3.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.INGRAM,
      resultado: 'Negativo',
      observacoes: 'Exame específico solicitado',
      dataExame: new Date('2024-12-09T11:30:00'),
      dataResultado: new Date('2024-12-11T15:30:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente1.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.CHAGAS,
      resultado: 'Negativo',
      observacoes: 'Exame de triagem',
      dataExame: new Date('2024-12-08T14:00:00'),
      dataResultado: new Date('2024-12-10T12:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente2.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.BACILOSCOPIA_ESCARRO,
      resultado: 'Negativo',
      observacoes: 'Exame para detecção de tuberculose',
      dataExame: new Date('2024-12-07T07:00:00'),
      dataResultado: new Date('2024-12-09T13:00:00'),
      status: StatusExame.CONCLUIDO,
      pacienteId: paciente3.id,
    },
  })

  // Exames pendentes
  await prisma.exame.create({
    data: {
      tipo: TipoExame.BETA_HCG,
      dataExame: new Date('2024-12-16T15:00:00'),
      status: StatusExame.PENDENTE,
      pacienteId: paciente1.id,
    },
  })

  await prisma.exame.create({
    data: {
      tipo: TipoExame.COVID,
      dataExame: new Date('2024-12-16T16:30:00'),
      status: StatusExame.PROCESSANDO,
      pacienteId: paciente2.id,
    },
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Criados:`)
  console.log(`   - 3 pacientes`)
  console.log(`   - 11 exames`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
