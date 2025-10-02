import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
export async function getAllWorkers() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('Persona')
    .select('*')
    .eq('rol', 'empleado');

  if (error) {
    return { data: [], status: 400, message: 'Error al obtener los empleados' };
  }

  return { data: Array.isArray(data) ? data : [], status: 200 };
}
