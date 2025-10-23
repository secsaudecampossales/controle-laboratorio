import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePatientToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { cpf, rg } = await request.json()

    if (!cpf || !rg) {
      return NextResponse.json({ error: 'CPF e RG são obrigatórios' }, { status: 400 })
    }

    // Buscar paciente pelo CPF
    const paciente = await prisma.paciente.findUnique({ 
      where: { cpf: cpf.trim() } 
    })
    
    if (!paciente) {
      return NextResponse.json({ error: 'CPF não encontrado' }, { status: 404 })
    }

    // Verificar se o RG confere
    if (paciente.rg !== rg.trim()) {
      return NextResponse.json({ error: 'RG incorreto' }, { status: 401 })
    }

    const token = generatePatientToken({ patientId: paciente.id, nome: paciente.nome, role: 'patient' })

    const response = NextResponse.json({
      message: 'Login do paciente realizado com sucesso',
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
      },
    })

    response.cookies.set('patient-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Erro no login do paciente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


