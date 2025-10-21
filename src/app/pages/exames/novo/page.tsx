'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/AppLayout'
import { ArrowLeft, Save, TestTube, User } from 'lucide-react'

interface Paciente {
  id: string
  nome: string
  cpf: string
}

const TIPOS_EXAME = [
  { value: 'BETA_HCG', label: 'Beta HCG' },
  { value: 'DENGUE', label: 'Dengue' },
  { value: 'CHIKUNGUNYA', label: 'Chikungunya' },
  { value: 'ZIKA', label: 'Zika' },
  { value: 'COVID', label: 'COVID-19' },
  { value: 'PPD', label: 'PPD' },
  { value: 'INGRAM', label: 'Ingram' },
  { value: 'CHAGAS', label: 'Chagas' },
  { value: 'BACILOSCOPIA_ESCARRO', label: 'Baciloscopia de Escarro' }
]

export default function NovoExamePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [formData, setFormData] = useState({
    tipo: '',
    pacienteId: '',
    observacoes: ''
  })

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const response = await fetch('/api/pacientes')
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/exames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/pages/exames')
        router.refresh()
      } else {
        const error = await response.json()
        alert('Erro ao cadastrar exame: ' + error.error)
      }
    } catch (error) {
      console.error('Erro ao cadastrar exame:', error)
      alert('Erro ao cadastrar exame')
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Novo Exame</h1>
            <p className="text-gray-600 mt-2">
              Cadastrar um novo exame no sistema
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paciente */}
              <div className="md:col-span-2">
                <label htmlFor="pacienteId" className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="pacienteId"
                    name="pacienteId"
                    required
                    value={formData.pacienteId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome} {paciente.cpf && `- ${paciente.cpf}`}
                      </option>
                    ))}
                  </select>
                </div>
                {pacientes.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Nenhum paciente cadastrado. <a href="/pages/pacientes/novo" className="text-blue-600 hover:underline">Cadastrar paciente</a>
                  </p>
                )}
              </div>

              {/* Tipo de Exame */}
              <div className="md:col-span-2">
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Exame *
                </label>
                <div className="relative">
                  <TestTube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo de exame</option>
                    {TIPOS_EXAME.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                  placeholder="Digite observações sobre o exame (opcional)"
                />
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Informações sobre o exame</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• O exame será criado com status "Pendente"</li>
                <li>• A data do exame será registrada automaticamente</li>
                <li>• Você poderá atualizar o resultado posteriormente</li>
                <li>• O status será alterado conforme o progresso do exame</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.pacienteId || !formData.tipo}
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
                    Salvar Exame
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
