'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppLayout from '../../../components/AppLayout'
import { ArrowLeft, Save, TestTube, User, Calendar, CheckCircle, Clock, XCircle, Play } from 'lucide-react'

interface Exame {
  id: string
  tipo: string
  tipoCustom?: string | null
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

const STATUS_OPTIONS = [
  { value: 'PENDENTE', label: 'Pendente', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'PROCESSANDO', label: 'Processando', icon: Play, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'CONCLUIDO', label: 'Concluído', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'CANCELADO', label: 'Cancelado', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' }
]

export default function ExameDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [exame, setExame] = useState<Exame | null>(null)
  const [formData, setFormData] = useState({
    resultado: '',
    observacoes: '',
    status: ''
  })
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const fetchExame = useCallback(async () => {
    try {
      const response = await fetch(`/api/exames?id=${params.id}`)
      if (response.ok) {
        const exames = await response.json()
        if (exames.length > 0) {
          const exameData = exames[0]
          setExame(exameData)
          setFormData({
            resultado: exameData.resultado || '',
            observacoes: exameData.observacoes || '',
            status: exameData.status
          })
        }
      }
    } catch (error) {
      console.error('Erro ao buscar exame:', error)
    }
  }, [params.id])

  useEffect(() => {
    fetchExame()
  }, [fetchExame])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusChange = async (status: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/exames/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: status,
          dataResultado: status === 'CONCLUIDO' ? new Date().toISOString() : null
        }),
      })

      if (response.ok) {
        await fetchExame() // Recarregar dados
        setShowStatusModal(false)
        setNewStatus('')
      } else {
        const error = await response.json()
        alert('Erro ao atualizar status: ' + error.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/exames/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/exames')
        router.refresh()
      } else {
        const error = await response.json()
        alert('Erro ao atualizar exame: ' + error.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar exame:', error)
      alert('Erro ao atualizar exame')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDENTE':
        return ['PROCESSANDO', 'CANCELADO']
      case 'PROCESSANDO':
        return ['CONCLUIDO', 'CANCELADO']
      case 'CONCLUIDO':
        return ['PROCESSANDO'] // Permite voltar para processando se necessário
      case 'CANCELADO':
        return ['PENDENTE'] // Permite reativar
      default:
        return []
    }
  }

  if (!exame) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    )
  }

  const currentStatusInfo = getStatusInfo(exame.status)
  const nextStatusOptions = getNextStatusOptions(exame.status)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Exame</h1>
            <p className="text-gray-600 mt-2">
              Visualizar e gerenciar informações do exame
            </p>
          </div>
        </div>

        {/* Informações do Exame */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Exame</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paciente */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Paciente</p>
                <p className="text-lg font-semibold text-gray-900">{exame.paciente.nome}</p>
                {exame.paciente.cpf && (
                  <p className="text-sm text-gray-500">{exame.paciente.cpf}</p>
                )}
              </div>
            </div>

            {/* Tipo de Exame */}
            <div className="flex items-center space-x-3">
              <TestTube className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tipo de Exame</p>
                <p className="text-lg font-semibold text-gray-900">{exame.tipo === 'OUTROS' ? 'Outros' : exame.tipo.replace('_', ' ')}</p>
                {exame.tipo === 'OUTROS' && exame.tipoCustom && (
                  <p className="text-sm text-gray-500">{exame.tipoCustom}</p>
                )}
              </div>
            </div>

            {/* Data do Exame */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Data do Exame</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(exame.dataExame).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Status Atual */}
            <div className="flex items-center space-x-3">
              <currentStatusInfo.icon className={`h-5 w-5 ${currentStatusInfo.color}`} />
              <div>
                <p className="text-sm font-medium text-gray-600">Status Atual</p>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${currentStatusInfo.bgColor} ${currentStatusInfo.color}`}>
                  {currentStatusInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas de Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Status</h2>
          
          <div className="flex flex-wrap gap-3">
            {nextStatusOptions.map((status) => {
              const statusInfo = getStatusInfo(status)
              const IconComponent = statusInfo.icon
              
              return (
                <button
                  key={status}
                  onClick={() => {
                    setNewStatus(status)
                    setShowStatusModal(true)
                  }}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-dashed hover:border-solid transition-all ${statusInfo.bgColor} ${statusInfo.color} hover:shadow-md disabled:opacity-50`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">Marcar como {statusInfo.label}</span>
                </button>
              )
            })}
          </div>
          
          {nextStatusOptions.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhuma alteração de status disponível</p>
          )}
        </div>

        {/* Formulário de Edição */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Informações</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resultado */}
              <div>
                <label htmlFor="resultado" className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado
                </label>
                <input
                  type="text"
                  id="resultado"
                  name="resultado"
                  value={formData.resultado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Positivo, Negativo, etc."
                />
              </div>

              {/* Observações */}
              <div className="md:col-span-2">
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite observações sobre o exame"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal de Confirmação de Status */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar Alteração de Status
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Você está prestes a alterar o status do exame de <strong>{currentStatusInfo.label}</strong> para <strong>{getStatusInfo(newStatus).label}</strong>.
                </p>
                
                {newStatus === 'CONCLUIDO' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Ao marcar como concluído, a data de resultado será registrada automaticamente.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleStatusChange(newStatus)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${getStatusInfo(newStatus).bgColor.replace('bg-', 'bg-').replace('-100', '-600')}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Alterando...
                    </>
                  ) : (
                    `Confirmar ${getStatusInfo(newStatus).label}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
