'use client'

import { useEffect, useState } from 'react'
import { PatientAuthGuard } from '@/components/AuthGuard'
import { usePatientAuth } from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'

interface Paciente { id: string; nome: string }
interface Exame {
  id: string
  tipo: string
  tipoCustom?: string | null
  resultado?: string | null
  observacoes?: string | null
  dataExame: string
  dataResultado?: string | null
  status: string
  paciente: Paciente
}

export default function PortalExamesPage() {
  const [exames, setExames] = useState<Exame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { paciente, logout } = usePatientAuth()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pacientes/exames')
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Falha ao carregar exames')
        }
        const data = await res.json()
        setExames(data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <PatientAuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Meus Exames</h1>
              {paciente && (
                <p className="text-sm text-gray-600">Bem-vindo, {paciente.nome}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Carregando exames...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {exames.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum exame encontrado</h3>
                  <p className="text-gray-600">Você ainda não possui exames cadastrados no sistema.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {exames.map((exame) => (
                    <div key={exame.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="font-medium text-gray-900">
                          {exame.tipo === 'OUTROS' ? exame.tipoCustom ?? 'OUTROS' : exame.tipo}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          exame.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' :
                          exame.status === 'PROCESSANDO' ? 'bg-yellow-100 text-yellow-800' :
                          exame.status === 'PENDENTE' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {exame.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Realizado em: {new Date(exame.dataExame).toLocaleDateString('pt-BR')}</div>
                        {exame.dataResultado && (
                          <div>Resultado em: {new Date(exame.dataResultado).toLocaleDateString('pt-BR')}</div>
                        )}
                      </div>
                      
                      {exame.resultado && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm font-medium text-gray-900 mb-1">Resultado</div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">{exame.resultado}</div>
                        </div>
                      )}
                      
                      {exame.observacoes && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-900 mb-1">Observações</div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">{exame.observacoes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PatientAuthGuard>
  )
}


