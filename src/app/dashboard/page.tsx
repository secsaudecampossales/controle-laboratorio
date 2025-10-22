import AppLayout from '../../components/AppLayout'
import Link from 'next/link'
import { 
  TestTube, 
  Users, 
  FileText, 
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { prisma } from '../../lib/prisma'

type RecentExame = {
  id: string
  tipo: string
  status: string
  paciente: {
    nome: string
  }
}

async function getEstatisticas() {
  try {
    // Query database directly from server component for up-to-date stats
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const [examesHoje, totalPacientes, examesPendentes, examesEsteMes, examesRecentes] = await Promise.all([
      prisma.exame.count({ where: { dataExame: { gte: hoje, lt: amanha } } }),
      prisma.paciente.count(),
      prisma.exame.count({ where: { status: 'PENDENTE' } }),
      prisma.exame.count({ where: { dataExame: { gte: inicioMes } } }),
      prisma.exame.findMany({
        take: 5,
        orderBy: { dataExame: 'desc' },
        include: { paciente: true }
      })
    ])

    // Serialize recent exames to the shape expected by the UI
    const examesRecentesSerialized = examesRecentes.map((e) => ({
      id: e.id,
      tipo: String(e.tipo),
      status: String(e.status),
      paciente: { nome: e.paciente?.nome || '—' }
    }))

    return {
      examesHoje,
      totalPacientes,
      examesPendentes,
      examesEsteMes,
      examesRecentes: examesRecentesSerialized
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas via Prisma:', error)
    return {
      examesHoje: 0,
      totalPacientes: 0,
      examesPendentes: 0,
      examesEsteMes: 0,
      examesRecentes: []
    }
  }
}

export default async function Dashboard() {
  const estatisticas = await getEstatisticas()
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do laboratório de saúde de Campos Sales
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exames Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.examesHoje}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPacientes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.examesPendentes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.examesEsteMes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/exames/novo" 
                className="group p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                    <TestTube className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-semibold text-blue-900">Novo Exame</span>
                  <span className="text-xs text-blue-600 mt-1">Cadastrar exame</span>
                </div>
              </Link>
              
              <Link 
                href="/pacientes/novo" 
                className="group p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-semibold text-green-900">Novo Paciente</span>
                  <span className="text-xs text-green-600 mt-1">Cadastrar paciente</span>
                </div>
              </Link>
              
              <Link 
                href="/relatorios" 
                className="group p-4 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-purple-100 rounded-full mb-3 group-hover:bg-purple-200 transition-colors">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-semibold text-purple-900">Relatórios</span>
                  <span className="text-xs text-purple-600 mt-1">Gerar relatórios</span>
                </div>
              </Link>
              
              <Link 
                href="/exames" 
                className="group p-4 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-orange-100 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="font-semibold text-orange-900">Ver Exames</span>
                  <span className="text-xs text-orange-600 mt-1">Listar todos</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Exames Recentes
            </h2>
            <div className="space-y-3">
              {estatisticas.examesRecentes.map((exame: RecentExame) => (
                <div key={exame.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{exame.tipo.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{exame.paciente.nome}</p>
                  </div>
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
                </div>
              ))}
              {estatisticas.examesRecentes.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum exame encontrado</p>
              )}
            </div>
          </div>
        </div>

        {/* Tipos de exames disponíveis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tipos de Exames Disponíveis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'Beta HCG', 'Dengue', 'Chikungunya', 'Zika', 'COVID-19',
              'PPD', 'Ingram', 'Chagas', 'Baciloscopia de Escarro'
            ].map((exame) => (
              <div key={exame} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-700">{exame}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
