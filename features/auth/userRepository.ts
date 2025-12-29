'use server';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';

export async function getUserByEmail(email: string) {
  const supabase = await getSupabaseServer();
  const { data: userData, error: userError } = await supabase
    .from('Persona')
    .select('email, rol, nombre')
    .eq('email', email.trim())
    .maybeSingle();

  if (userError || !userData) {
    return null; // retornás null si no se encuentra el usuario o hay error
  }

  return userData;
}

export async function sigIn(email: string, password: string) {
  const supabase = await getSupabaseServer();
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });
  return { data: authData, error: authError };
}

export async function requestPassword(email: string) {
  const supabase = await getSupabaseServer();
  // Usar redirectTo dinámico basado en el entorno
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/new-password`,
  });
  return error;
}

export async function updatePassword(newPassword: string, code: string) {
  // Requiere que la sesión ya esté activa en las cookies (session establecida desde server-side reset)
  const supabase = await getSupabaseServer();

  const { data, error: errorRecuperacion } =
    await supabase.auth.exchangeCodeForSession(code);
  console.log(errorRecuperacion);
  if (errorRecuperacion) {
    return {
      status: 400,
      message: 'El enlace de recuperación no es válido',
      data: null,
    };
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return error;
  }
  return null;
}

export async function signOut() {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signOut();
  return error;
}
