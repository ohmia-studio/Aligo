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

export async function resetPassword(newPassword: string): Promise<Result> {
  try {
    const error = await updatePassword(newPassword);
    console.log(error);
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
    return { status: 500, message: 'Internal server error', data: null };
  }
}

// Función para validar la contraseña
function validatePassword(password: string): string | null {
  if (!password || password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  // Verificar que tenga al menos un número
  if (!/\d/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }

  // Verificar que tenga al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)';
  }

  // Verificar que tenga al menos una letra
  if (!/[a-zA-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra';
  }

  return null; // Válida
}

// Server action dedicada para el form (evita importar de auth.ts)
export async function updatePasswordAction(
  formData: FormData
): Promise<Result> {
  const newPassword = String(formData.get('newPassword') || '');
  const code = String(formData.get('code') || '');

  // Validar la contraseña
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return {
      status: 400,
      message: passwordError,
      data: null,
    };
  }
  // Llama directamente al userRepository
  const result = await updatePassword(newPassword, code);

  // Si updatePassword retorna un objeto con status, es un error de sesión
  if (result && result.status === 401) {
    return {
      status: 401,
      message: result.message,
      data: null,
    };
  }
  // Si retorna un error de Supabase
  if (result && result.message) {
    return {
      status: 400,
      message: result.message,
      data: null,
    };
  }
  // Si todo ok
  return {
    status: 200,
    message: 'Contraseña actualizada con éxito',
    data: null,
  };
}
