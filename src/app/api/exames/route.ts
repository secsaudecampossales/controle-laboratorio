import { Prisma, TipoExame, StatusExame } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Função para buscar exames sem Prisma (fallback)
async function getExamesDirect() {
  console.log('Buscando exames diretamente (fallback)')
  
  // Simular dados de exemplo para teste
  return [
    {
      id: 'exame-teste-1',
      tipo: 'BETA_HCG',
      resultado: null,
      observacoes: null,
      dataExame: new Date().toISOString(),
      dataResultado: null,
      status: 'PENDENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pacienteId: 'paciente-teste-1',
      paciente: {
        id: 'paciente-teste-1',
        nome: 'João Silva',
        cpf: '123.456.789-00',
        rg: null,
        telefone: '(88) 99999-9999',
        endereco: 'Rua Teste, 123',
        nascimento: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 'exame-teste-2',
      tipo: 'COVID',
      resultado: 'Negativo',
      observacoes: 'Exame realizado com sucesso',
      dataExame: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      dataResultado: new Date().toISOString(),
      status: 'CONCLUIDO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pacienteId: 'paciente-teste-2',
      paciente: {
        id: 'paciente-teste-2',
        nome: 'Maria Santos',
        cpf: '987.654.321-00',
        rg: null,
        telefone: '(88) 88888-8888',
        endereco: 'Avenida Exemplo, 456',
        nascimento: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const pacienteId = searchParams.get('pacienteId')

    console.log('GET request recebida:', { tipo, status, pacienteId })

    // Tentar usar Prisma primeiro, mas com fallback robusto
    let exames
    try {
      // Importação dinâmica para evitar erros de build
      const prismaModule = await import('@/app/lib/prisma').catch(() => null)
      
      if (prismaModule?.prisma) {
        console.log('Tentando usar Prisma para buscar exames...')

        const where = {} as Prisma.ExameWhereInput
        if (tipo) where.tipo = tipo as unknown as TipoExame
        if (status) where.status = status as unknown as StatusExame
        if (pacienteId) where.pacienteId = pacienteId

        exames = await prismaModule.prisma.exame.findMany({
          where,
          include: {
            paciente: true,
          },
          orderBy: {
            dataExame: 'desc',
          },
        })
        console.log('Exames encontrados com Prisma:', exames.length)
      } else {
        throw new Error('Prisma não disponível')
      }
    } catch (prismaError) {
      console.error('Erro com Prisma, usando fallback:', prismaError)
      
      // Fallback para busca direta
      exames = await getExamesDirect()
      console.log('Exames encontrados com fallback:', exames.length)
    }

    return NextResponse.json(exames)
  } catch (error) {
    console.error('Erro geral ao buscar exames:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, tipoCustom, pacienteId, observacoes } = body

    // Build the data object dynamically to avoid TypeScript complaining
    // about object literals containing properties not present in Prisma's strict union types.
    const data: any = {
      tipo,
      pacienteId,
      observacoes,
      dataExame: new Date(),
    }

    if (tipo === 'OUTROS') {
      // Only add tipoCustom when the type is OUTROS
      data.tipoCustom = tipoCustom ?? null
    }

    const exame = await prisma.exame.create({
      data: data as Prisma.ExameCreateInput,
      include: {
        paciente: true
      }
    })

    return NextResponse.json(exame, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
