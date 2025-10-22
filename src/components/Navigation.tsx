'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Home, 
  Users, 
  TestTube, 
  FileText, 
  BarChart3,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pacientes', href: '/pacientes', icon: Users },
  { name: 'Exames', href: '/exames', icon: TestTube },
  { name: 'Relatórios', href: '/relatorios', icon: FileText },
  { name: 'Estatísticas', href: '/estatisticas', icon: BarChart3 },
]

export default function Navigation() {
  const pathname = usePathname()
  const { usuario, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 min-h-screen w-64 flex flex-col">
      <div className="p-6 flex-1">
        <h1 className="text-xl font-bold text-gray-800 mb-8">
          Laboratório Campos Sales
        </h1>
        
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* User info and logout */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
            <p className="text-xs text-gray-500">{usuario?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </nav>
  )
}
