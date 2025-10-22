import { Prisma, TipoExame, StatusExame } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const pacienteId = searchParams.get('pacienteId')

    console.log('GET request recebida:', { tipo, status, pacienteId })

    // Import prisma dynamically to avoid unexpected build-time issues,
    // but fail loudly if not available in the runtime environment.
    const prismaModule = await import('@/lib/prisma').catch(() => null)
    if (!prismaModule?.prisma) {
      console.error('Prisma client is not available. Ensure DATABASE_URL is set in the environment.')
      return NextResponse.json(
        { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
        { status: 500 }
      )
    }

    const where = {} as Prisma.ExameWhereInput
    if (tipo) where.tipo = tipo as unknown as TipoExame
    if (status) where.status = status as unknown as StatusExame
    if (pacienteId) where.pacienteId = pacienteId

    const exames = await prismaModule.prisma.exame.findMany({
      where,
      include: { paciente: true },
      orderBy: { dataExame: 'desc' },
    })

    return NextResponse.json(exames)
  } catch (error) {
    console.error('Erro ao buscar exames:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, tipoCustom, pacienteId, observacoes } = body

    // Ensure prisma is available at runtime
    if (!prisma) {
      console.error('Prisma client not available at POST /api/exames')
      return NextResponse.json(
        { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
        { status: 500 }
      )
    }

    const createPayload = {
      tipo: tipo as TipoExame,
      pacienteId,
      observacoes,
      dataExame: new Date(),
      ...(tipo === 'OUTROS' ? { tipoCustom: tipoCustom ?? null } : {}),
    }

    const exame = await prisma.exame.create({
      data: createPayload as unknown as Prisma.ExameCreateInput,
      include: { paciente: true },
    })

    return NextResponse.json(exame, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
