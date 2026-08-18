import api from './axiosInstance';
import type { LoginResponse } from '../types/usuario.types';

export async function login(codigo_usuario: string, clave: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { codigo_usuario, clave });
  return data;
}

export async function cambiarPassword(clave_actual: string, nueva_clave: string, confirmacion: string) {
  const { data } = await api.post('/auth/cambiar-password', {
    clave_actual,
    nueva_clave,
    confirmacion,
  });
  return data;
}