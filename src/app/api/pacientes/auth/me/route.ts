import { NextRequest, NextResponse } from 'next/server'
import { verifyPatientToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('patient-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyPatientToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    return NextResponse.json({ paciente: { id: payload.patientId, nome: payload.nome } })
  } catch (error) {
    console.error('Erro ao verificar paciente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


