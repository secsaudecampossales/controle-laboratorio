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
  User,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-30 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Navigation */}
      <nav className={`bg-white shadow-lg border-r border-gray-200 min-h-screen w-64 flex flex-col lg:flex-col md:w-64 sm:w-full fixed lg:relative z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 sm:p-6 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 sm:mb-8">
            Laboratório Campos Sales
          </h1>
          
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{item.name}</span>
                    <span className="sm:hidden">{item.name.split(' ')[0]}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        
        {/* User info and logout */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex items-center mb-3 sm:mb-4">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{usuario?.nome}</p>
              <p className="text-xs text-gray-500 truncate">{usuario?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
            <span className="sm:hidden">{isLoggingOut ? '...' : 'Sair'}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
