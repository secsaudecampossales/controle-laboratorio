import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPatientToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('patient-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const payload = verifyPatientToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const exames = await prisma.exame.findMany({
      where: { pacienteId: payload.patientId },
      include: { paciente: true },
      orderBy: { dataExame: 'desc' },
    })

    return NextResponse.json(exames)
  } catch (error) {
    console.error('Erro ao buscar exames do paciente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


