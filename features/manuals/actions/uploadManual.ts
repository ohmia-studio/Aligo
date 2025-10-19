'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import {
  createManualRow,
  removeManualFile,
  uploadManualFile,
} from '../manualRepository';

export async function uploadManualAction(formData: FormData): Promise<Result> {
  const file = formData.get('file') as File | null;
  const title = formData.get('title')?.toString().trim() ?? '';
  if (!file || !title) {
    return {
      status: 400,
      message: 'Título y archivo son obligatorios',
      data: null,
    };
  }

  const safeKey = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  try {
    const uploadResp = await uploadManualFile(safeKey, file);
    if (uploadResp.error) {
      return {
        status: 500,
        message: 'Error subiendo archivo',
        data: uploadResp.error,
      };
    }

    const row = {
      title,
      file_path: uploadResp.data.path,
      file_name: file.name,
      content_type: (file as any).type,
      size: file.size,
      url: uploadResp.data.url,
      created_at: new Date().toISOString(),
    };

    const createResp = await createManualRow(row);
    if (createResp.error) {
      // rollback archivo
      try {
        await removeManualFile(safeKey);
      } catch (_) {}
      return {
        status: 500,
        message: 'Error guardando metadata',
        data: createResp.error,
      };
    }

    return {
      status: 200,
      message: 'Manual subido correctamente',
      data: createResp.data,
    };
  } catch (err) {
    console.error('uploadManualAction error:', err);
    try {
      await removeManualFile(safeKey);
    } catch (_) {}
    return {
      status: 500,
      message: 'Error inesperado al subir manual',
      data: null,
    };
  }
}
