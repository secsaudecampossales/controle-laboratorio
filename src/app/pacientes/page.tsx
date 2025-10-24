'use client'

import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'

type Paciente = {
  id: string
  nome: string
  cpf?: string | null
  telefone?: string | null
  exames?: { dataExame: string }[]
}

export default function PacientesPage() {
  // const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pacienteToDelete, setPacienteToDelete] = useState<Paciente | null>(null)

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const response = await fetch('/api/pacientes')
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
      } else {
        console.error('Erro ao buscar pacientes')
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (paciente: Paciente) => {
    setPacienteToDelete(paciente)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pacienteToDelete) return

    setDeletingId(pacienteToDelete.id)
    try {
      const response = await fetch(`/api/pacientes?id=${pacienteToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await response.json()
        setPacientes(prev => prev.filter(p => p.id !== pacienteToDelete.id))
      } else {
        const error = await response.json()
        alert('Erro ao excluir paciente: ' + error.error)
      }
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      alert('Erro ao excluir paciente')
    } finally {
      setDeletingId(null)
      setShowDeleteModal(false)
      setPacienteToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPacienteToDelete(null)
  }

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Gerenciar cadastro de pacientes do laboratório
            </p>
          </div>
          <Link href="/pacientes/novo" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mt-4 sm:mt-0">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Novo Paciente</span>
          </Link>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou telefone..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                <option>Todos os pacientes</option>
                <option>Com exames pendentes</option>
                <option>Com exames concluídos</option>
              </select>
              <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
                Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pacientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando pacientes...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        CPF
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Telefone
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Último Exame
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pacientes.map((paciente: Paciente) => (
                      <tr key={paciente.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm sm:text-base font-medium text-gray-900">{paciente.nome}</div>
                            <div className="text-xs sm:text-sm text-gray-500 sm:hidden">{paciente.cpf || 'Sem CPF'}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {paciente.cpf || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {paciente.telefone || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                          {paciente.exames && paciente.exames.length > 0 
                            ? new Date(paciente.exames[0].dataExame).toLocaleDateString('pt-BR')
                            : 'Nenhum exame'
                          }
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Ativo
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/pacientes/${paciente.id}`} className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(paciente)}
                              disabled={deletingId === paciente.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === paciente.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pacientes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Nenhum paciente encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              <div className="bg-white px-3 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Próximo
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
                      <span className="font-medium">97</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Anterior
                      </button>
                      <button className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-blue-50 text-xs sm:text-sm font-medium text-blue-600">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Próximo
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && pacienteToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Tem certeza que deseja excluir o paciente <strong>{pacienteToDelete.nome}</strong>?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ <strong>Atenção:</strong> Todos os exames associados a este paciente também serão excluídos permanentemente.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === pacienteToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deletingId === pacienteToDelete.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Excluindo...
                    </>
                  ) : (
                    'Excluir Paciente'
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