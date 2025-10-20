import AppLayout from '../components/AppLayout'
import { FileText, Download, Calendar, BarChart3, Printer } from 'lucide-react'

export default function RelatoriosPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-2">
              Gerar relatórios mensais e estatísticas do laboratório
            </p>
          </div>
        </div>

        {/* Filtros de período */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Selecionar Período
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Janeiro</option>
                <option>Fevereiro</option>
                <option>Março</option>
                <option>Abril</option>
                <option>Maio</option>
                <option>Junho</option>
                <option>Julho</option>
                <option>Agosto</option>
                <option>Setembro</option>
                <option>Outubro</option>
                <option>Novembro</option>
                <option>Dezembro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* Relatório de exemplo - Outubro 2024 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Relatório Mensal - Outubro 2024
              </h2>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Resumo executivo */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo Executivo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total de Exames</p>
                      <p className="text-2xl font-bold text-blue-900">156</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Exames Concluídos</p>
                      <p className="text-2xl font-bold text-green-900">142</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-600">Taxa de Conclusão</p>
                      <p className="text-2xl font-bold text-yellow-900">91%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhamento por tipo de exame */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhamento por Tipo de Exame
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Exame
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Positivos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Negativos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendentes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Beta HCG
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        45
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        12
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        33
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        COVID-19
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        38
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        8
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        28
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Dengue
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        25
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        3
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        22
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Chikungunya
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        18
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        16
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Zika
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        14
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        PPD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        8
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        6
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Ingram
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        3
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        3
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Chagas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Baciloscopia de Escarro
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observações */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Observações do Mês
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Maior demanda por exames de Beta HCG (45 exames)</li>
                <li>• Taxa de positividade para COVID-19: 21%</li>
                <li>• Todos os exames de PPD foram concluídos no prazo</li>
                <li>• 14 exames ainda pendentes de processamento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Relatórios anteriores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Relatórios Anteriores
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Setembro 2024</p>
                  <p className="text-sm text-gray-600">142 exames realizados</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Visualizar
                  </button>
                  <button className="text-green-600 hover:text-green-900 text-sm">
                    Baixar
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Agosto 2024</p>
                  <p className="text-sm text-gray-600">128 exames realizados</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Visualizar
                  </button>
                  <button className="text-green-600 hover:text-green-900 text-sm">
                    Baixar
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Julho 2024</p>
                  <p className="text-sm text-gray-600">135 exames realizados</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Visualizar
                  </button>
                  <button className="text-green-600 hover:text-green-900 text-sm">
                    Baixar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}