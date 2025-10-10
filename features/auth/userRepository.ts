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
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/login',
  });
  return error;
}

export async function updatePassword(newPassword: string, token: string) {
  const supabase = await getSupabaseServer();
  const { data: userData, error: errorData } =
    await supabase.auth.exchangeCodeForSession(token); // Recupera sesión con el token

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (errorData || error) {
    console.log('errorData', errorData);
    console.log('error', error);
    return errorData || error;
  }
  return null;
}

export async function signOut() {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signOut();
  return error;
}
