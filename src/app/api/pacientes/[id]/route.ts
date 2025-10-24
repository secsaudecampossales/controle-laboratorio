import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'ID do paciente é obrigatório' }, { status: 400 })
    }

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        exames: {
          orderBy: {
            dataExame: 'desc'
          }
        }
      }
    })

    if (!paciente) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(paciente)
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, cpf, rg, telefone, endereco, nascimento, numeroSus } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do paciente é obrigatório' }, { status: 400 })
    }

    // Verificar se o paciente existe
    const existingPaciente = await prisma.paciente.findUnique({
      where: { id }
    })

    if (!existingPaciente) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    const paciente = await prisma.paciente.update({
      where: { id },
      data: {
        nome,
        cpf,
        rg,
        telefone,
        endereco,
        nascimento: nascimento ? new Date(nascimento) : null,
        numeroSus
      },
      include: {
        exames: {
          orderBy: {
            dataExame: 'desc'
          }
        }
      }
    })

    return NextResponse.json(paciente)
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
