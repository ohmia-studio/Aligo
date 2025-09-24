// services/userService.ts
import { getSupabaseServer } from '@/lib/supabaseServer';
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
