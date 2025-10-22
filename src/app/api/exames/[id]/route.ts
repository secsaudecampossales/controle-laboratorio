import { NextResponse } from 'next/server'
import { StatusExame } from '@prisma/client'

type UpdateExameData = {
  resultado?: string | null
  observacoes?: string | null
  status?: string
  dataResultado?: string | null
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const id = segments[segments.length - 1]

    console.log('PUT request recebida:', { id })

    if (!id) {
      return NextResponse.json({ error: 'ID do exame é obrigatório' }, { status: 400 })
    }

    const body = await request.json()
    const { resultado, observacoes, status, dataResultado } = body as UpdateExameData

    // Require Prisma to be present in runtime; fail loudly if not.
    const prismaModule = await import('@/lib/prisma').catch(() => null)
    if (!prismaModule?.prisma) {
      console.error('Prisma client not available for updating exame')
      return NextResponse.json(
        { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
        { status: 500 }
      )
    }

    const exame = await prismaModule.prisma.exame.update({
      where: { id },
      data: {
        resultado,
        observacoes,
        status: status as unknown as StatusExame,
        dataResultado: dataResultado ? new Date(dataResultado).toISOString() : null,
      },
      include: { paciente: true },
    })

    return NextResponse.json(exame)
  } catch (error) {
    console.error('Erro ao atualizar exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const id = segments[segments.length - 1]

    if (!id) {
      return NextResponse.json({ error: 'ID do exame é obrigatório' }, { status: 400 })
    }

    const prismaModule = await import('@/lib/prisma').catch(() => null)
    if (!prismaModule?.prisma) {
      console.error('Prisma client not available for deleting exame')
      return NextResponse.json(
        { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
        { status: 500 }
      )
    }

    await prismaModule.prisma.exame.delete({ where: { id } })
    return NextResponse.json({ message: 'Exame excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir exame:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
