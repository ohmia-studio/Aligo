'use server';

import {
  getUserByEmail,
  requestPassword,
  updatePassword,
} from '@/features/auth/userRepository';
import { Result } from '@/interfaces/server-response-interfaces';
export async function requestResetPassword(email: string): Promise<Result> {
  const user = await getUserByEmail(email);
  if (user === null) {
    return { status: 400, message: 'El email no está registrado', data: null };
  }
  try {
    const error = await requestPassword(email);
    if (error) {
      return { status: 400, message: error.message, data: null };
    }
    return {
      status: 200,
      message: 'Correo de restablecimiento enviado',
      data: null,
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Internal server error', data: null };
  }
}

export async function resetPassword(
  newPassword: string,
  code: string
): Promise<Result> {
  try {
    const error = await updatePassword(newPassword, code);
    if (error) {
      return {
        status: 400,
        message:
          'La contraseña debe poseer al menos 6 caracteres, entre ellos: Números, Caracteres especiales ($,@,_) y letras',
        data: null,
      };
    }
    return {
      status: 200,
      message: 'Contraseña actualizada con éxito',
      data: null,
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Internal server error', data: null };
  }
}

// Server action dedicada para el form (evita importar de auth.ts)
export async function updatePasswordAction(
  formData: FormData
): Promise<Result> {
  const newPassword = String(formData.get('newPassword') || '');
  const code = String(formData.get('code') || '');
  if (!newPassword || newPassword.length < 6) {
    return {
      status: 400,
      message:
        'La contraseña debe poseer al menos 6 caracteres, entre ellos: Números, Caracteres especiales ($,@,_) y letras',
      data: null,
    };
  }
  return await resetPassword(newPassword, code);
}
