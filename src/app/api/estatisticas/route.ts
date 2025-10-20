import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const [
      examesHoje,
      totalPacientes,
      examesPendentes,
      examesEsteMes,
      examesRecentes
    ] = await Promise.all([
      // Exames de hoje
      prisma.exame.count({
        where: {
          dataExame: {
            gte: hoje,
            lt: amanha
          }
        }
      }),
      
      // Total de pacientes
      prisma.paciente.count(),
      
      // Exames pendentes
      prisma.exame.count({
        where: {
          status: 'PENDENTE'
        }
      }),
      
      // Exames deste mês
      prisma.exame.count({
        where: {
          dataExame: {
            gte: inicioMes
          }
        }
      }),
      
      // Exames recentes
      prisma.exame.findMany({
        take: 5,
        orderBy: {
          dataExame: 'desc'
        },
        include: {
          paciente: true
        }
      })
    ])

    return NextResponse.json({
      examesHoje,
      totalPacientes,
      examesPendentes,
      examesEsteMes,
      examesRecentes
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
