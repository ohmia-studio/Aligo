import { getSupabaseServer } from '@/lib/supabaseServer';

const supabase = await getSupabaseServer();

export async function registrarEmpleado({ nombre }: { nombre: string }) {
  const { data, error } = await supabase.from('empleados').insert([{ nombre }])
  if (error) throw error
  return data
}
