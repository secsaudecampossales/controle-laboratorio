import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = parseInt(searchParams.get('mes') || '1')
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear().toString())
    
    console.log('GET relatório recebido:', { mes, ano })
    
    // Validar parâmetros
    if (mes < 1 || mes > 12) {
      return NextResponse.json(
        { error: 'Mês deve estar entre 1 e 12' },
        { status: 400 }
      )
    }
    
    if (ano < 2020 || ano > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Ano inválido' },
        { status: 400 }
      )
    }
    
    // Use Prisma; fail loudly if not available
    let relatorioData
    try {
      const prismaModule = await import('@/app/lib/prisma').catch(() => null)
      
      if (prismaModule?.prisma) {
        console.log('Tentando usar Prisma para buscar relatório...')
        
        // Calcular datas do início e fim do mês
        const dataInicio = new Date(ano, mes - 1, 1)
        const dataFim = new Date(ano, mes, 0, 23, 59, 59)
        
        // Buscar exames do período
        const exames = await prismaModule.prisma.exame.findMany({
          where: {
            dataExame: {
              gte: dataInicio,
              lte: dataFim
            }
          },
          include: {
            paciente: true
          }
        })
        
        // Processar dados
        const totalExames = exames.length
        
        // Agrupar por tipo
        const examesPorTipoMap = new Map()
        exames.forEach(exame => {
          const tipo = exame.tipo
          examesPorTipoMap.set(tipo, (examesPorTipoMap.get(tipo) || 0) + 1)
        })
        
        const examesPorTipo = Array.from(examesPorTipoMap.entries()).map(([tipo, quantidade]) => ({
          tipo,
          quantidade,
          percentual: totalExames > 0 ? (quantidade / totalExames) * 100 : 0
        }))
        
        // Agrupar por status
        const examesPorStatusMap = new Map()
        exames.forEach(exame => {
          const status = exame.status
          examesPorStatusMap.set(status, (examesPorStatusMap.get(status) || 0) + 1)
        })
        
        const examesPorStatus = Array.from(examesPorStatusMap.entries()).map(([status, quantidade]) => ({
          status,
          quantidade,
          percentual: totalExames > 0 ? (quantidade / totalExames) * 100 : 0
        }))
        
        // Agrupar por semana
        const examesPorSemanaMap = new Map()
        exames.forEach(exame => {
          const data = new Date(exame.dataExame)
          const semana = Math.ceil(data.getDate() / 7)
          const chave = `Semana ${semana}`
          examesPorSemanaMap.set(chave, (examesPorSemanaMap.get(chave) || 0) + 1)
        })
        
        const examesPorSemana = Array.from(examesPorSemanaMap.entries()).map(([semana, quantidade]) => ({
          semana,
          quantidade
        }))
        
        relatorioData = {
          mes: mes.toString().padStart(2, '0'),
          ano,
          totalExames,
          examesPorTipo,
          examesPorStatus,
          examesPorSemana,
        }

        console.log('Relatório gerado com Prisma:', relatorioData)
      } else {
        console.error('Prisma client not available for relatorios')
        return NextResponse.json(
          { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
          { status: 500 }
        )
      }
    } catch (prismaError) {
      console.error('Erro ao gerar relatório com Prisma:', prismaError)
      return NextResponse.json(
        { error: 'Erro ao gerar relatório', details: prismaError instanceof Error ? prismaError.message : String(prismaError) },
        { status: 500 }
      )
    }

    return NextResponse.json(relatorioData)
  } catch (error) {
    console.error('Erro geral ao gerar relatório:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
