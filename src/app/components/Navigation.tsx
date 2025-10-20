'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  TestTube, 
  FileText, 
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Pacientes', href: '/pages/pacientes', icon: Users },
  { name: 'Exames', href: '/pages/exames', icon: TestTube },
  { name: 'Relatórios', href: '/pages/relatorios', icon: FileText },
  { name: 'Estatísticas', href: '/pages/estatisticas', icon: BarChart3 },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 min-h-screen w-64">
      <div className="p-6">
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
    </nav>
  )
}
