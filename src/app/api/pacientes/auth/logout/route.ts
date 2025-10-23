import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: 'Logout do paciente realizado com sucesso'
  })

  // Remover cookie de autenticação do paciente
  response.cookies.set('patient-auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0 // Expira imediatamente
  })

  return response
}
