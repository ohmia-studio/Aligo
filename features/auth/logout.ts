'use server';

import { getSupabaseServer } from '@/lib/supabaseServer';

interface LogoutResult {
  status: number;
  message: string;
}
export async function logoutUser(): Promise<LogoutResult> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      status: 401,
      message: 'Error al cerrar sesion',
    };
  }
  return {
    status: 200,
    message: 'Sesión cerrada con éxito',
  };
}
