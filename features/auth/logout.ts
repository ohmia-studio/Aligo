'use server';

import { signOut } from '@/features/auth/userRepository';
import { Result } from '@/interfaces/server-response-interfaces';

export async function logoutUser(): Promise<Result> {
  const error = await signOut();
  if (error) {
    return {
      status: 401,
      message: 'Error al cerrar sesion',
      data: null,
    };
  }
  return {
    status: 200,
    message: 'Sesión cerrada con éxito',
    data: null,
  };
}
