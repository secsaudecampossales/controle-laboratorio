'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthState {
  usuario: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    usuario: null,
    loading: true,
    isAuthenticated: false
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          usuario: data.usuario,
          loading: false,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          usuario: null,
          loading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthState({
        usuario: null,
        loading: false,
        isAuthenticated: false
      });
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          usuario: data.usuario,
          loading: false,
          isAuthenticated: true
        });
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setAuthState({
        usuario: null,
        loading: false,
        isAuthenticated: false
      });
      // Redirecionar para a página de login após logout
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar o estado e redirecionar
      setAuthState({
        usuario: null,
        loading: false,
        isAuthenticated: false
      });
      router.push('/login');
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth
  };
}

// Paciente auth hook
interface PatientAuthState {
  paciente: { id: string; nome: string } | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function usePatientAuth() {
  const [state, setState] = useState<PatientAuthState>({ paciente: null, loading: true, isAuthenticated: false });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/pacientes/auth/me');
      if (res.ok) {
        const data = await res.json();
        setState({ paciente: data.paciente, loading: false, isAuthenticated: true });
      } else {
        setState({ paciente: null, loading: false, isAuthenticated: false });
      }
    } catch (e) {
      setState({ paciente: null, loading: false, isAuthenticated: false });
    }
  };

  const login = async (cpf: string, rg: string) => {
    try {
      const res = await fetch('/api/pacientes/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, rg }),
      });
      if (res.ok) {
        const data = await res.json();
        setState({ paciente: data.paciente, loading: false, isAuthenticated: true });
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err.error };
    } catch (e) {
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/pacientes/auth/logout', { method: 'POST' })
    } catch {}
    setState({ paciente: null, loading: false, isAuthenticated: false })
    router.push('/portal/login')
  }

  return { ...state, login, logout, checkAuth };
}
