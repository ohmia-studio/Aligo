'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import {
  deleteAuthUser,
  deletePersonaByIds,
  getPersonAuthIdsByIds,
} from './employeeRepository';

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
    const { data: persons, error: selErr } = await getPersonAuthIdsByIds(ids);
    if (selErr) {
      console.error('Error obteniendo personas:', selErr);
      return { status: 500, message: 'Error al obtener empleados', data: null };
    }

    const { error: delErr } = await deletePersonaByIds(ids);
    if (delErr) {
      console.error('Error borrando Persona:', delErr);
      return {
        status: 500,
        message: 'Error al eliminar empleados',
        data: null,
      };
    }

    const authErrors: any[] = [];
    for (const p of Array.isArray(persons) ? persons : []) {
      if (p?.auth_id) {
        try {
          const { error } = await deleteAuthUser(p.auth_id);
          if (error)
            authErrors.push({
              auth_id: p.auth_id,
              message: error.message || error,
            });
        } catch (e) {
          authErrors.push({ auth_id: p.auth_id, message: e });
        }
      }
    }

    if (authErrors.length > 0) {
      return {
        status: 206,
        message: 'Eliminados, pero hubo errores borrando usuarios de Auth',
        data: { authErrors },
      };
    }

    return {
      status: 200,
      message: 'Empleados eliminados correctamente',
      data: null,
    };
  } catch (err) {
    console.error('Error inesperado en deleteEmployeeAction:', err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
}
