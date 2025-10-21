import { NextRequest, NextResponse } from 'next/server'

type ExamePorTipo = { tipo: string; quantidade: number; percentual: number }
type ExamePorStatus = { status: string; quantidade: number; percentual: number }
type ExamePorSemana = { semana: string; quantidade: number }

type RelatorioData = {
  totalExames: number
  examesPorTipo: ExamePorTipo[]
  examesPorStatus: ExamePorStatus[]
  examesPorSemana: ExamePorSemana[]
}

// Função para gerar PDF simples sem dependências externas
function generateSimplePDF(data: RelatorioData, mes: number, ano: number) {
  // Criar conteúdo HTML simples que pode ser convertido para PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório de Exames - ${mes.toString().padStart(2, '0')}/${ano}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; }
        .section { margin: 20px 0; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .summary { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Relatório de Exames</div>
        <div class="subtitle">Período: ${mes.toString().padStart(2, '0')}/${ano}</div>
        <div class="subtitle">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>
      </div>
      
      <div class="summary">
        <strong>Total de Exames Realizados: ${data.totalExames}</strong>
      </div>
      
      <div class="section">
        <div class="section-title">Exames por Tipo</div>
        <table>
          <thead>
            <tr>
              <th>Tipo de Exame</th>
              <th>Quantidade</th>
              <th>Percentual</th>
            </tr>
          </thead>
          <tbody>
            ${data.examesPorTipo.map((item) => `
              <tr>
                <td>${item.tipo.replace('_', ' ')}</td>
                <td>${item.quantidade}</td>
                <td>${item.percentual.toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Exames por Status</div>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Quantidade</th>
              <th>Percentual</th>
            </tr>
          </thead>
          <tbody>
            ${data.examesPorStatus.map((item) => `
              <tr>
                <td>${item.status === 'CONCLUIDO' ? 'Concluído' :
                     item.status === 'PROCESSANDO' ? 'Processando' :
                     item.status === 'PENDENTE' ? 'Pendente' : 'Cancelado'}</td>
                <td>${item.quantidade}</td>
                <td>${item.percentual.toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Exames por Semana</div>
        <table>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            ${data.examesPorSemana.map((item) => `
              <tr>
                <td>${item.semana}</td>
                <td>${item.quantidade}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema de Controle de Laboratório</p>
      </div>
    </body>
    </html>
  `
  
  return htmlContent
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mes, ano, data } = body
    
    console.log('Gerando relatório HTML para:', { mes, ano })
    
    // Validar dados
    if (!data || !mes || !ano) {
      return NextResponse.json(
        { error: 'Dados do relatório são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Gerar HTML do relatório
    const htmlContent = generateSimplePDF(data, mes, ano)
    
    // Retornar HTML que pode ser convertido para PDF pelo navegador
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="relatorio-exames-${mes.toString().padStart(2, '0')}-${ano}.html"`
      }
    })
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
