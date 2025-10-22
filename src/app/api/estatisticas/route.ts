import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Buscando estatísticas...')
    
    // Tentar usar Prisma primeiro, mas com fallback robusto
    let estatisticas
    try {
      // Importação dinâmica para evitar erros de build
      const prismaModule = await import('@/app/lib/prisma').catch(() => null)
      
      if (prismaModule?.prisma) {
        console.log('Tentando usar Prisma para buscar estatísticas...')
        
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const amanha = new Date(hoje)
        amanha.setDate(amanha.getDate() + 1)

        const inicioMes = new Date()
        inicioMes.setDate(1)
        inicioMes.setHours(0, 0, 0, 0)

        const inicioAno = new Date()
        inicioAno.setMonth(0, 1)
        inicioAno.setHours(0, 0, 0, 0)

        console.log('Executando consultas no banco...')

        const [
          examesHoje,
          totalPacientes,
          examesPendentes,
          examesProcessando,
          examesConcluidos,
          totalExames,
          examesPorTipo,
          examesPorStatus,
          examesRecentes
        ] = await Promise.all([
          // Exames de hoje
          prismaModule.prisma.exame.count({
            where: {
              dataExame: {
                gte: hoje,
                lt: amanha
              }
            }
          }),
          
          // Total de pacientes
          prismaModule.prisma.paciente.count(),
          
          // Exames pendentes
          prismaModule.prisma.exame.count({
            where: {
              status: 'PENDENTE'
            }
          }),
          
          // Exames processando
          prismaModule.prisma.exame.count({
            where: {
              status: 'PROCESSANDO'
            }
          }),
          
          // Exames concluídos
          prismaModule.prisma.exame.count({
            where: {
              status: 'CONCLUIDO'
            }
          }),
          
          // Total de exames
          prismaModule.prisma.exame.count(),
          
          // Exames por tipo
          prismaModule.prisma.exame.groupBy({
            by: ['tipo'],
            _count: {
              tipo: true
            }
          }),
          
          // Exames por status
          prismaModule.prisma.exame.groupBy({
            by: ['status'],
            _count: {
              status: true
            }
          }),
          
          // Exames recentes
          prismaModule.prisma.exame.findMany({
            take: 5,
            orderBy: {
              dataExame: 'desc'
            },
            include: {
              paciente: true
            }
          })
        ])

        console.log('Dados obtidos:', {
          totalExames,
          totalPacientes,
          examesPendentes,
          examesProcessando,
          examesConcluidos,
          examesHoje
        })

        // Buscar exames por mês (últimos 12 meses)
        const examesPorMes = []
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        
        for (let i = 0; i < 12; i++) {
          const mesInicio = new Date()
          mesInicio.setMonth(mesInicio.getMonth() - i, 1)
          mesInicio.setHours(0, 0, 0, 0)
          
          const mesFim = new Date(mesInicio)
          mesFim.setMonth(mesFim.getMonth() + 1)
          mesFim.setHours(0, 0, 0, 0)
          
          const quantidade = await prismaModule.prisma.exame.count({
            where: {
              dataExame: {
                gte: mesInicio,
                lt: mesFim
              }
            }
          })
          
          examesPorMes.unshift({
            mes: meses[mesInicio.getMonth()],
            quantidade
          })
        }

        // Processar dados do Prisma
        const examesPorTipoProcessados = examesPorTipo.map(item => ({
          tipo: item.tipo,
          quantidade: item._count.tipo,
          positivos: Math.floor(item._count.tipo * 0.2), // Simular 20% de positivos
          percentual: totalExames > 0 ? (item._count.tipo / totalExames) * 100 : 0
        }))

        const examesPorStatusProcessados = examesPorStatus.map(item => ({
          status: item.status,
          quantidade: item._count.status,
          percentual: totalExames > 0 ? (item._count.status / totalExames) * 100 : 0
        }))

        // Calcular taxa de positividade (simulada)
        const totalPositivos = examesPorTipoProcessados.reduce((sum, item) => sum + item.positivos, 0)
        const taxaPositividade = totalExames > 0 ? (totalPositivos / totalExames) * 100 : 0

        estatisticas = {
          totalExames,
          examesHoje,
          examesPendentes,
          examesProcessando,
          examesConcluidos,
          totalPacientes,
          examesPorTipo: examesPorTipoProcessados,
          examesPorStatus: examesPorStatusProcessados,
          examesPorMes,
          examesRecentes,
          taxaPositividade: taxaPositividade,
          tempoMedioProcessamento: 2.3, // Simulado
          crescimentoAnual: 15.0, // Simulado
          tendencias: {
            exames: { valor: 12, tipo: 'crescimento' },
            positividade: { valor: -2.1, tipo: 'diminuicao' },
            tempo: { valor: 0.2, tipo: 'aumento' },
            crescimento: { valor: 15, tipo: 'crescimento' }
          }
        }
        
        console.log('Estatísticas encontradas com Prisma:', estatisticas.totalExames)
      } else {
        console.error('Prisma client not available for estatisticas')
        return NextResponse.json(
          { error: 'Prisma client not available. Configure DATABASE_URL in the environment.' },
          { status: 500 }
        )
      }
    } catch (prismaError) {
      console.error('Erro ao calcular estatísticas com Prisma:', prismaError)
      return NextResponse.json(
        { error: 'Erro ao calcular estatísticas', details: prismaError instanceof Error ? prismaError.message : String(prismaError) },
        { status: 500 }
      )
    }

    return NextResponse.json(estatisticas)
  } catch (error) {
    console.error('Erro geral ao buscar estatísticas:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
