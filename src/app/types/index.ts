import { TipoExame, StatusExame } from '@prisma/client'

export type { TipoExame, StatusExame }

export interface Paciente {
  id: string
  nome: string
  cpf?: string
  rg?: string
  telefone?: string
  endereco?: string
  nascimento?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Exame {
  id: string
  tipo: TipoExame
  tipoCustom?: string
  resultado?: string
  observacoes?: string
  dataExame: Date
  dataResultado?: Date
  status: StatusExame
  createdAt: Date
  updatedAt: Date
  pacienteId: string
  paciente?: Paciente
}

export interface ExameComPaciente extends Exame {
  paciente: Paciente
}

export interface RelatorioMensal {
  mes: string
  ano: number
  totalExames: number
  examesPorTipo: Record<TipoExame, number>
  examesPorStatus: Record<StatusExame, number>
}

export const TIPOS_EXAME_LABELS: Record<TipoExame, string> = {
  BETA_HCG: 'Beta HCG',
  DENGUE: 'Dengue',
  CHIKUNGUNYA: 'Chikungunya',
  ZIKA: 'Zika',
  COVID: 'COVID-19',
  PPD: 'PPD',
  INGRAM: 'Ingram',
  CHAGAS: 'Chagas',
  BACILOSCOPIA_ESCARRO: 'Baciloscopia de Escarro',
  OUTROS: 'Outros'
}

export const STATUS_EXAME_LABELS: Record<StatusExame, string> = {
  PENDENTE: 'Pendente',
  PROCESSANDO: 'Processando',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado'
}
