'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import {
  deleteManualRowByIds,
  getManualsByIds,
  removeManualFile,
} from '../manualRepository';

export async function deleteManualAction(formData: FormData): Promise<Result> {
  const selected = formData.getAll('selected') as string[];
  if (!selected || selected.length === 0) {
    return {
      status: 400,
      message: 'No se seleccionó ningún manual',
      data: null,
    };
  }
  const ids = selected.map((s) => (isNaN(Number(s)) ? s : Number(s)));

  try {
    const { data: manuals, error: getErr } = await getManualsByIds(ids);
    if (getErr) {
      console.error('Error obteniendo manuales:', getErr);
      return { status: 500, message: 'Error al obtener manuales', data: null };
    }

    const fileErrors: Array<{ path: string; error: any }> = [];
    for (const m of Array.isArray(manuals) ? manuals : []) {
      if (m?.file_path) {
        const resp = await removeManualFile(m.file_path);
        if (resp.error)
          fileErrors.push({ path: m.file_path, error: resp.error });
      }
    }

    const delResp = await deleteManualRowByIds(ids);
    if (delResp.error) {
      console.error('Error borrando filas de manual:', delResp.error);
      return { status: 500, message: 'Error al eliminar manuales', data: null };
    }

    if (fileErrors.length > 0) {
      return {
        status: 206,
        message:
          'Manuales eliminados, pero hubo errores borrando algunos archivos',
        data: { fileErrors },
      };
    }

    return {
      status: 200,
      message: 'Manuales eliminados correctamente',
      data: null,
    };
  } catch (err) {
    console.error('deleteManualAction error:', err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
}
