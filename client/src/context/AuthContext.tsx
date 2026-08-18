import { createContext, useState, type ReactNode } from 'react';
import type { Usuario, OpcionPerfil } from '../types/usuario.types';
import * as authApi from '../api/auth.api';

// Jerarquía de tipo de rol, igual que en SP_Validar_Acceso_Opcion
const NIVEL: Record<string, number> = { CONS: 1, PROC_MAS: 2, APRB: 3, MANT: 4 };

interface AuthContextType {
  usuario: Usuario | null;
  perfil: OpcionPerfil[];
  isAuthenticated: boolean;
  login: (codigo_usuario: string, clave: string) => Promise<void>;
  logout: () => void;
  tieneAcceso: (codigoOpcion: string, tipoRolMinimo: string) => boolean;
  marcarPasswordCambiada: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function cargarUsuarioInicial(): Usuario | null {
  const raw = localStorage.getItem('siga_usuario');
  return raw ? JSON.parse(raw) : null;
}

function cargarPerfilInicial(): OpcionPerfil[] {
  const raw = localStorage.getItem('siga_perfil');
  return raw ? JSON.parse(raw) : [];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(cargarUsuarioInicial());
  const [perfil, setPerfil] = useState<OpcionPerfil[]>(cargarPerfilInicial());

  async function login(codigo_usuario: string, clave: string) {
    const data = await authApi.login(codigo_usuario, clave);

    localStorage.setItem('siga_token', data.token);
    localStorage.setItem('siga_usuario', JSON.stringify(data.usuario));
    localStorage.setItem('siga_perfil', JSON.stringify(data.perfil));

    setUsuario(data.usuario);
    setPerfil(data.perfil);
  }

  function logout() {
    localStorage.removeItem('siga_token');
    localStorage.removeItem('siga_usuario');
    localStorage.removeItem('siga_perfil');
    setUsuario(null);
    setPerfil([]);
  }

  // Réplica en el frontend de la misma jerarquía que valida SP_Validar_Acceso_Opcion.
  // OJO: esto es solo para pintar/ocultar UI (UX). El backend SIEMPRE
  // vuelve a validar con el SP real antes de escribir nada — esta función
  // nunca es la fuente de verdad de seguridad.
  function tieneAcceso(codigoOpcion: string, tipoRolMinimo: string): boolean {
    if (usuario?.es_admin_sistema) return true;

    const opcion = perfil.find((p) => p.codigo_opcion === codigoOpcion);
    if (!opcion) return false;

    return NIVEL[opcion.tipo_rol_codigo] >= NIVEL[tipoRolMinimo];
  }

  // Se llama después de un cambio de contraseña exitoso, para que el
  // ProtectedRoute deje de forzar la redirección a /cambiar-password
  // sin necesidad de volver a hacer login.
  function marcarPasswordCambiada() {
    if (!usuario) return;
    const actualizado = { ...usuario, debe_cambiar_pass: false };
    localStorage.setItem('siga_usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, perfil, isAuthenticated: !!usuario, login, logout, tieneAcceso, marcarPasswordCambiada }}
    >
      {children}
    </AuthContext.Provider>
  );
}