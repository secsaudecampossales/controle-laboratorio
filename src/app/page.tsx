import AppLayout from './components/AppLayout'
import { 
  TestTube, 
  Users, 
  FileText, 
  TrendingUp,
  AlertCircle
} from 'lucide-react'

async function getEstatisticas() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/estatisticas`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      examesHoje: 0,
      totalPacientes: 0,
      examesPendentes: 0,
      examesEsteMes: 0,
      examesRecentes: []
    }
  }
}

export default async function Home() {
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <a href="/exames/novo" className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <TestTube className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Novo Exame</span>
                </div>
              </a>
              <a href="/pacientes/novo" className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Cadastrar Paciente</span>
                </div>
              </a>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Gerar Relatório</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Exames Recentes
            </h2>
            <div className="space-y-3">
              {estatisticas.examesRecentes.map((exame: any) => (
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
