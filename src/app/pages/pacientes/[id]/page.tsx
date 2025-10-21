'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/AppLayout'
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar, TestTube } from 'lucide-react'

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  rg: string | null
  telefone: string | null
  endereco: string | null
  nascimento: string | null
  createdAt: string
  exames: Array<{
    id: string
    tipo: string
    status: string
    dataExame: string
    resultado: string | null
  }>
}

export default function PacienteDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [paciente, setPaciente] = useState<Paciente | null>(null)

  useEffect(() => {
    fetchPaciente()
  }, [params.id])

  const fetchPaciente = async () => {
    try {
      const response = await fetch(`/api/pacientes`)
      if (response.ok) {
        const pacientes = await response.json()
        const pacienteData = pacientes.find((p: Paciente) => p.id === params.id)
        if (pacienteData) {
          setPaciente(pacienteData)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar paciente:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return 'bg-green-100 text-green-800'
      case 'PROCESSANDO':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDENTE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'BETA_HCG':
        return 'bg-blue-100 text-blue-800'
      case 'COVID':
        return 'bg-red-100 text-red-800'
      case 'DENGUE':
        return 'bg-orange-100 text-orange-800'
      case 'CHIKUNGUNYA':
        return 'bg-purple-100 text-purple-800'
      case 'ZIKA':
        return 'bg-green-100 text-green-800'
      case 'PPD':
        return 'bg-yellow-100 text-yellow-800'
      case 'INGRAM':
        return 'bg-indigo-100 text-indigo-800'
      case 'CHAGAS':
        return 'bg-pink-100 text-pink-800'
      case 'BACILOSCOPIA_ESCARRO':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!paciente) {
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{paciente.nome}</h1>
              <p className="text-gray-600 mt-2">
                Detalhes do paciente e histórico de exames
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
        </div>

        {/* Informações do Paciente */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                <p className="text-lg font-semibold text-gray-900">{paciente.nome}</p>
              </div>
            </div>

            {/* CPF */}
            {paciente.cpf && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-lg font-semibold text-gray-900">{paciente.cpf}</p>
                </div>
              </div>
            )}

            {/* RG */}
            {paciente.rg && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">RG</p>
                  <p className="text-lg font-semibold text-gray-900">{paciente.rg}</p>
                </div>
              </div>
            )}

            {/* Telefone */}
            {paciente.telefone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <p className="text-lg font-semibold text-gray-900">{paciente.telefone}</p>
                </div>
              </div>
            )}

            {/* Data de Nascimento */}
            {paciente.nascimento && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Nascimento</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(paciente.nascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {/* Endereço */}
            {paciente.endereco && (
              <div className="flex items-start space-x-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Endereço</p>
                  <p className="text-lg font-semibold text-gray-900">{paciente.endereco}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Exames */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              Histórico de Exames ({paciente.exames.length})
            </h2>
          </div>
          
          {paciente.exames.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                  {paciente.exames.map((exame) => (
                    <tr key={exame.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(exame.tipo)}`}>
                          {exame.tipo.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(exame.dataExame).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exame.status)}`}>
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
                        <a 
                          href={`/pages/exames/${exame.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver detalhes
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum exame encontrado para este paciente</p>
              <a 
                href={`/pages/exames/novo?paciente=${paciente.id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Cadastrar primeiro exame
              </a>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
