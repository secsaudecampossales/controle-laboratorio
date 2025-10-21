'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Play, XCircle } from 'lucide-react'

interface StatusButtonProps {
  exameId: string
  currentStatus: string
  onStatusChange: (newStatus: string) => void
}

const STATUS_ACTIONS = {
  PENDENTE: [
    { 
      status: 'PROCESSANDO', 
      label: 'Processar', 
      icon: Play, 
      color: 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border-yellow-300' 
    },
    { 
      status: 'CANCELADO', 
      label: 'Cancelar', 
      icon: XCircle, 
      color: 'text-red-700 bg-red-100 hover:bg-red-200 border-red-300' 
    }
  ],
  PROCESSANDO: [
    { 
      status: 'CONCLUIDO', 
      label: 'Concluir', 
      icon: CheckCircle, 
      color: 'text-green-700 bg-green-100 hover:bg-green-200 border-green-300' 
    },
    { 
      status: 'CANCELADO', 
      label: 'Cancelar', 
      icon: XCircle, 
      color: 'text-red-700 bg-red-100 hover:bg-red-200 border-red-300' 
    }
  ],
  CONCLUIDO: [
    { 
      status: 'PROCESSANDO', 
      label: 'Reabrir', 
      icon: Play, 
      color: 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border-yellow-300' 
    }
  ],
  CANCELADO: [
    { 
      status: 'PENDENTE', 
      label: 'Reativar', 
      icon: Clock, 
      color: 'text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-300' 
    }
  ]
}

export default function StatusActionButtons({ exameId, currentStatus, onStatusChange }: StatusButtonProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    // Validação do ID
    if (!exameId || exameId.trim() === '') {
      console.error('ID do exame não fornecido:', exameId)
      alert('Erro: ID do exame não encontrado')
      return
    }

    console.log('Tentando atualizar status:', { exameId, newStatus })
    setLoading(newStatus)
    
    try {
      const url = `/api/exames/${exameId}`
      console.log('Fazendo requisição para:', url)
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          dataResultado: newStatus === 'CONCLUIDO' ? new Date().toISOString() : null
        }),
      })

      console.log('Resposta recebida:', response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log('Status atualizado com sucesso:', result)
        onStatusChange(newStatus)
      } else {
        const errorData = await response.json()
        console.error('Erro na API:', errorData)
        alert(`Erro ao atualizar status: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  const availableActions = STATUS_ACTIONS[currentStatus as keyof typeof STATUS_ACTIONS] || []

  if (availableActions.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-1">
      {availableActions.map((action) => {
        const IconComponent = action.icon
        const isLoading = loading === action.status
        
        return (
          <button
            key={action.status}
            onClick={() => handleStatusChange(action.status)}
            disabled={isLoading}
            className={`
              p-2 rounded-md border 
              transition-all duration-200 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95
              shadow-sm hover:shadow-md
              ${action.color}
              ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
            `}
            title={action.label}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <IconComponent className="h-4 w-4" />
            )}
          </button>
        )
      })}
    </div>
  )
}
