'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';

export async function deleteEmployeeAction(
  formData: FormData
): Promise<Result> {
  const selected = formData.getAll('selected') as string[];
  if (!selected || selected.length === 0) {
    return {
      status: 400,
      message: 'No se seleccionó ningún empleado',
      data: null,
    };
  }

  const ids = selected.map((s) => (isNaN(Number(s)) ? s : Number(s)));

  try {
    // obtener auth_id si existen
    const { data: persons, error: selErr } = await supabaseAdmin
      .from('Persona')
      .select('id, auth_id')
      .in('id', ids);
    if (selErr)
      return { status: 500, message: 'Error al obtener empleados', data: null };

    // eliminar en tabla Persona
    const { error: delErr } = await supabaseAdmin
      .from('Persona')
      .delete()
      .in('id', ids);
    if (delErr)
      return {
        status: 500,
        message: 'Error al eliminar empleados',
        data: null,
      };

    // borrar usuarios en Auth (si tenían auth_id) — opcional/asincrónico según tu preferencia
    for (const p of Array.isArray(persons) ? persons : []) {
      if (p?.auth_id) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(p.auth_id);
        } catch (e) {
          // log y continuar
          console.warn('Error borrando usuario auth:', p.auth_id, e);
        }
      }
    }

    return {
      status: 200,
      message: 'Empleados eliminados correctamente',
      data: null,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
}
