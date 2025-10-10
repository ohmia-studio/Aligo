'use server';
import { getUserByEmail, sigIn } from '@/features/auth/userRepository';
import { Result } from '@/interfaces/server-response-interfaces';
import { validatePassword } from '@/lib/validations';
// Parámetros de login
import { LoginParams } from '@/interfaces/auth-interfaces';

export async function loginUser({
  email,
  password,
}: LoginParams): Promise<Result> {
  // si es función, ejecutarla para obtener el cliente
  const errorPsw = validatePassword(password);
  if (errorPsw) {
    return { status: 400, message: errorPsw, data: null };
  }
  try {
    const userData = await getUserByEmail(email);
    if (!userData) {
      return { status: 401, message: 'Credenciales incorrectas', data: null };
    }
    const { data, error } = await sigIn(email, password);

    if (error || !data.session) {
      return { status: 401, message: 'Credenciales incorrectas', data: null };
    }

    return {
      status: 200,
      message: 'Login exitoso',
      data: { user: data.user, role: userData.rol },
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Error interno del servidor', data: null };
  }
}
