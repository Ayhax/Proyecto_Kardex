// Coincide con el payload del JWT que arma el backend en SP_Cargar_Perfil_Usuario

export interface OpcionPerfil {
  codigo_modulo: string;
  codigo_opcion: string;
  nombre_opcion: string;
  tipo_rol_codigo: 'CONS' | 'PROC_MAS' | 'APRB' | 'MANT';
  nivel_jerarquia: number;
}

export interface Usuario {
  id_usuario: number;
  codigo_usuario: string;
  nombre_usuario: string;
  es_admin_sistema: boolean;
  debe_cambiar_pass: boolean;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  perfil: OpcionPerfil[];
}