'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import { validateEmail } from '@/lib/validations';
import { loginUser } from './login';
import { requestResetPassword, updatePasswordAction } from './resetPassword';
export async function authAction(formData: FormData): Promise<Result> {
  // Verifica a que función debe llamar dependiendo reset mode
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const resetMode = formData.get('resetMode') === 'true';
  const emailError = validateEmail(username);
  if (emailError) {
    return { status: 400, message: emailError, data: null };
  }
  if (resetMode) {
    return await requestResetPassword(username);
  } else {
    const result = await loginUser({ email: username, password });
    // Solo devolvemos el resultado, la redirección se hará en el cliente
    return result;
  }
}
// Server action para el form de nueva contraseña
export { updatePasswordAction };
