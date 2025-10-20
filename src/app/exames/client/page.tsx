'use client'

import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout'
import StatusActionButtons from '../../components/StatusActionButtons'
import { Plus, Search, Filter, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Exame {
  id: string
  tipo: string
  resultado: string | null
  observacoes: string | null
  dataExame: string
  dataResultado: string | null
  status: string
  paciente: {
    id: string
    nome: string
    cpf: string | null
  }
}

export default function ExamesPageClient() {
  const [exames, setExames] = useState<Exame[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExames = async () => {
    try {
      const response = await fetch('/api/exames')
      if (response.ok) {
        const data = await response.json()
        setExames(data)
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExames()
  }, [])

  const handleStatusChange = (exameId: string, newStatus: string) => {
    setExames(prev => prev.map(exame => 
      exame.id === exameId 
        ? { 
            ...exame, 
            status: newStatus,
            dataResultado: newStatus === 'CONCLUIDO' ? new Date().toISOString() : exame.dataResultado
          }
        : exame
    ))
  }

  // Calcular estatísticas
  const examesPendentes = exames.filter(exame => exame.status === 'PENDENTE').length
  const examesProcessando = exames.filter(exame => exame.status === 'PROCESSANDO').length
  const examesConcluidos = exames.filter(exame => exame.status === 'CONCLUIDO').length

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
            <p className="text-gray-600 mt-2">
              Gerenciar todos os exames realizados no laboratório
            </p>
          </div>
          <a href="/exames/novo" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Novo Exame
          </a>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por paciente ou tipo de exame..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todos os tipos</option>
                <option>Beta HCG</option>
                <option>Dengue</option>
                <option>Chikungunya</option>
                <option>Zika</option>
                <option>COVID-19</option>
                <option>PPD</option>
                <option>Ingram</option>
                <option>Chagas</option>
                <option>Baciloscopia de Escarro</option>
              </select>
            </div>
            <div>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todos os status</option>
                <option>Pendente</option>
                <option>Processando</option>
                <option>Concluído</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de exames */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data do Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exames.map((exame) => (
                  <tr key={exame.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exame.paciente.nome}</div>
                      <div className="text-sm text-gray-500">{exame.paciente.cpf || 'Sem CPF'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exame.tipo === 'BETA_HCG' ? 'bg-blue-100 text-blue-800' :
                        exame.tipo === 'COVID' ? 'bg-red-100 text-red-800' :
                        exame.tipo === 'DENGUE' ? 'bg-orange-100 text-orange-800' :
                        exame.tipo === 'CHIKUNGUNYA' ? 'bg-purple-100 text-purple-800' :
                        exame.tipo === 'ZIKA' ? 'bg-green-100 text-green-800' :
                        exame.tipo === 'PPD' ? 'bg-yellow-100 text-yellow-800' :
                        exame.tipo === 'INGRAM' ? 'bg-indigo-100 text-indigo-800' :
                        exame.tipo === 'CHAGAS' ? 'bg-pink-100 text-pink-800' :
                        exame.tipo === 'BACILOSCOPIA_ESCARRO' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {exame.tipo.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(exame.dataExame).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exame.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' :
                        exame.status === 'PROCESSANDO' ? 'bg-yellow-100 text-yellow-800' :
                        exame.status === 'PENDENTE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {exame.status === 'CONCLUIDO' ? 'Concluído' :
                         exame.status === 'PROCESSANDO' ? 'Processando' :
                         exame.status === 'PENDENTE' ? 'Pendente' :
                         'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exame.resultado || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <StatusActionButtons 
                          exameId={exame.id} 
                          currentStatus={exame.status}
                          onStatusChange={(newStatus) => handleStatusChange(exame.id, newStatus)}
                        />
                        <a href={`/exames/${exame.id}`} className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {exames.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nenhum exame encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
