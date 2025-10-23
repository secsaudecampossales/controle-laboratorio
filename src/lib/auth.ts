import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'laboratorio-campos-sales-secret-key-2024';

export interface TokenPayload {
  userId: string;
  email: string;
  nome: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Paciente-facing JWT helpers
export interface PatientTokenPayload {
  patientId: string;
  nome: string;
  role: 'patient';
}

export function generatePatientToken(payload: PatientTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyPatientToken(token: string): PatientTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as PatientTokenPayload;
  } catch (error) {
    return null;
  }
}
