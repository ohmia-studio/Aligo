'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { removeManualFile } from '../manualRepository';

export async function deleteManualAction(formData: FormData): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    return { status: 401, message: 'Unauthorized', data: null };
  }
  // Aquí esperamos que el cliente envíe los paths (file_path) en 'selected'
  const selected = formData.getAll('selected') as string[];
  if (!selected || selected.length === 0) {
    return {
      status: 400,
      message: 'No se seleccionó ningún manual',
      data: null,
    };
  }

  const fileErrors: Array<{ path: string; error: any }> = [];

  for (const path of selected) {
    try {
      const resp = await removeManualFile(path);
      if (resp.error) fileErrors.push({ path, error: resp.error });
    } catch (err) {
      fileErrors.push({ path, error: err });
    }
  }

  if (fileErrors.length > 0) {
    return {
      status: 206,
      message: 'Algunos archivos no pudieron eliminarse',
      data: { fileErrors },
    };
  }

  return {
    status: 200,
    message: 'Archivos eliminados correctamente',
    data: null,
  };
}
