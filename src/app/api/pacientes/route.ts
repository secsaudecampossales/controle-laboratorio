import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
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
    const { nome, cpf, rg, telefone, endereco, nascimento } = body

    const paciente = await prisma.paciente.create({
      data: {
        nome,
        cpf,
        rg,
        telefone,
        endereco,
        nascimento: nascimento ? new Date(nascimento) : null
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
