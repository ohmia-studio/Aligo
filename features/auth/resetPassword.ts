'use server';

import { getUserByEmail } from '@/features/auth/userService';
import { getSupabaseServer } from '@/lib/supabaseServer';
interface ResetResult {
  status: number;
  message: string;
}
export async function requestResetPassword(
  email: string
): Promise<ResetResult> {
  if (getUserByEmail(email) === null) {
    return { status: 400, message: 'El email no está registrado' };
  }
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/login/newPassword',
    });
    if (error) {
      return { status: 400, message: error.message };
    }
    return { status: 200, message: 'Correo de restablecimiento enviado' };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Internal server error' };
  }
}

export async function resetPassword(
  newPassword: string,
  token: string
): Promise<ResetResult> {
  try {
    const supabase = await getSupabaseServer();
    const { data: userData, error: errorData } =
      await supabase.auth.exchangeCodeForSession(token); // Recupera sesión con el token

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      return { status: 400, message: error.message };
    }
    return { status: 200, message: 'Contraseña actualizada con éxito' };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'Internal server error' };
  }
}
