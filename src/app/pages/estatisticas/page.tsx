'use client'

import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout'
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity } from 'lucide-react'

interface Estatisticas {
  totalExames: number
  examesHoje: number
  examesPendentes: number
  examesProcessando: number
  examesConcluidos: number
  totalPacientes: number
  examesPorTipo: Array<{
    tipo: string
    quantidade: number
    positivos: number
    percentual: number
  }>
  examesPorStatus: Array<{
    status: string
    quantidade: number
    percentual: number
  }>
  examesPorMes: Array<{
    mes: string
    quantidade: number
  }>
  taxaPositividade: number
  tempoMedioProcessamento: number
  crescimentoAnual: number
  tendencias: {
    exames: { valor: number; tipo: string }
    positividade: { valor: number; tipo: string }
    tempo: { valor: number; tipo: string }
    crescimento: { valor: number; tipo: string }
  }
}

export default function EstatisticasPage() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch('/api/estatisticas')
      if (response.ok) {
        const data = await response.json()
        setEstatisticas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEstatisticas()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    )
  }

  if (!estatisticas) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Erro ao carregar estatísticas</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas</h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada dos dados do laboratório
          </p>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Exames</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalExames.toLocaleString()}</p>
                <p className={`text-xs flex items-center ${
                  estatisticas.tendencias.exames.tipo === 'crescimento' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {estatisticas.tendencias.exames.valor > 0 ? '+' : ''}{estatisticas.tendencias.exames.valor}% este mês
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Positividade</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.taxaPositividade}%</p>
                <p className={`text-xs flex items-center ${
                  estatisticas.tendencias.positividade.tipo === 'diminuicao' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {estatisticas.tendencias.positividade.valor > 0 ? '+' : ''}{estatisticas.tendencias.positividade.valor}% este mês
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <PieChart className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.tempoMedioProcessamento} dias</p>
                <p className={`text-xs flex items-center ${
                  estatisticas.tendencias.tempo.tipo === 'aumento' ? 'text-red-600' : 'text-green-600'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {estatisticas.tendencias.tempo.valor > 0 ? '+' : ''}{estatisticas.tendencias.tempo.valor} dias
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Crescimento</p>
                <p className="text-2xl font-bold text-gray-900">+{estatisticas.crescimentoAnual}%</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  vs. ano anterior
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exames por mês */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Exames por Mês (2024)
            </h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {estatisticas.examesPorMes.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8 mb-2"
                    style={{ height: `${(item.quantidade / Math.max(...estatisticas.examesPorMes.map(m => m.quantidade))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {item.mes}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição por tipo */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribuição por Tipo de Exame
            </h2>
            <div className="space-y-4">
              {estatisticas.examesPorTipo.slice(0, 6).map((item, index) => {
                const cores = ['blue', 'green', 'yellow', 'red', 'purple', 'gray']
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 bg-${cores[index]}-500 rounded mr-3`}></div>
                      <span className="text-sm text-gray-700">{item.tipo.replace('_', ' ')}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.percentual.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabela de estatísticas detalhadas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Estatísticas Detalhadas por Tipo de Exame
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Realizados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Positivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa de Positividade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estatisticas.examesPorTipo.map((item, index) => {
                  const taxaPositividade = item.positivos > 0 ? ((item.positivos / item.quantidade) * 100) : 0
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.tipo.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantidade.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.positivos.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {taxaPositividade.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.percentual.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.percentual > 20 ? 'bg-green-100 text-green-800' :
                          item.percentual > 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.percentual > 20 ? 'Alto Volume' :
                           item.percentual > 10 ? 'Médio Volume' :
                           'Baixo Volume'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights e recomendações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Insights e Recomendações
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Pontos Positivos
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Crescimento consistente de {estatisticas.crescimentoAnual}% no volume de exames
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Tempo médio de processamento de {estatisticas.tempoMedioProcessamento} dias
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {estatisticas.examesPorTipo[0]?.tipo.replace('_', ' ')} é o exame mais realizado ({estatisticas.examesPorTipo[0]?.percentual.toFixed(1)}%)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {estatisticas.examesConcluidos} exames concluídos de {estatisticas.totalExames} total
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Áreas de Atenção
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    {estatisticas.examesPendentes} exames pendentes de processamento
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    {estatisticas.examesProcessando} exames em processamento
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    Taxa de positividade de {estatisticas.taxaPositividade}%
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    {estatisticas.totalPacientes} pacientes cadastrados no sistema
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
