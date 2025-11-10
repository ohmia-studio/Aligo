'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { removeManualFile, uploadManualFile } from '../manualRepository';

export async function uploadManualAction(formData: FormData): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    return { status: 401, message: 'Unauthorized', data: null };
  }
  const file = formData.get('file') as File | null;
  const title = formData.get('title')?.toString().trim() ?? '';

  if (!file || !title) {
    return {
      status: 400,
      message: 'Título y archivo son obligatorios',
      data: null,
    };
  }

  // Guardar siempre dentro de la carpeta "manuales/"
  const safeKey = `manuales/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  try {
    const uploadResp = await uploadManualFile(safeKey, file);
    if (uploadResp.error) {
      console.error('[uploadManualAction] upload error:', uploadResp.error);
      return {
        status: 500,
        message: 'Error subiendo archivo',
        data: uploadResp.error,
      };
    }

    // Devolvemos la info del upload (no guardamos en DB)
    return {
      status: 200,
      message: 'Manual subido correctamente',
      data: {
        title,
        file_name: file.name,
        file_path: uploadResp.data.path,
        content_type: (file as any).type,
        size: file.size,
        url: uploadResp.data.url ?? uploadResp.data.url,
      },
    };
  } catch (err: any) {
    console.error('[uploadManualAction] unexpected error:', err);
    try {
      await removeManualFile(safeKey);
    } catch (_) {}
    return {
      status: 500,
      message: 'Error inesperado al subir manual',
      data: err?.message ?? String(err),
    };
  }
}
