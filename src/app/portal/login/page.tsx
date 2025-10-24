'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePatientAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, User, CreditCard, Shield } from 'lucide-react'

export default function PortalLoginPage() {
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRg, setShowRg] = useState(false)
  const router = useRouter()
  const { login } = usePatientAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(cpf, rg)
    setLoading(false)
    if (res.success) router.push('/portal/exames')
    else setError(res.error || 'Falha no login')
  }

  const handleAdminLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full mx-auto">
        {/* Logo e Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Portal do Paciente
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Acesse seus exames com CPF e RG
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
              Acesso aos Exames
            </h2>
            <p className="text-sm sm:text-base text-gray-500 text-center mt-2">
              Informe seus dados para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Campo CPF */}
            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
            </div>

            {/* Campo RG */}
            <div className="space-y-2">
              <label htmlFor="rg" className="text-sm font-medium text-gray-700">
                RG
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="rg"
                  name="rg"
                  type={showRg ? 'text' : 'password'}
                  required
                  className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Seu RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowRg(!showRg)}
                >
                  {showRg ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Acessar Exames
                </>
              )}
            </button>
          </form>

          {/* Botão Administrador */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAdminLogin}
              className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Acesso Administrativo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 Laboratório Campos Sales. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}


