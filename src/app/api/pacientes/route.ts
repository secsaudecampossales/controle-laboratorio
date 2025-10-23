import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Import prisma dynamically but fail loudly if missing in runtime
    const prismaModule = await import('@/lib/prisma').catch(() => null)
    if (!prismaModule?.prisma) {
      console.error('Prisma client is not available. Ensure DATABASE_URL is set in the environment.')
      return NextResponse.json(
        { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
        { status: 500 }
      )
    }

    const pacientes = await prismaModule.prisma.paciente.findMany({
      include: {
        exames: {
          orderBy: {
            dataExame: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(pacientes)
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, cpf, rg, telefone, endereco, nascimento, numeroSus } = body

    const paciente = await prisma.paciente.create({
      data: {
        nome,
        cpf,
        rg,
        telefone,
        endereco,
        nascimento: nascimento ? new Date(nascimento) : null,
        numeroSus
      }
    })

    return NextResponse.json(paciente, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do paciente é obrigatório' }, { status: 400 })
    }

    // Verificar se o paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: { exames: true }
    })

    if (!paciente) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    // Excluir o paciente (os exames serão excluídos automaticamente devido ao onDelete: Cascade)
    await prisma.paciente.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Paciente e exames associados excluídos com sucesso',
      examesExcluidos: paciente.exames.length
    })
  } catch (error) {
    console.error('Erro ao excluir paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
