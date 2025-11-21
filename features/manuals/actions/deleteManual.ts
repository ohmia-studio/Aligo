'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { removeManualFile } from '../manualRepository';

export async function deleteManualAction(deletingKey: string): Promise<Result> {
  // Aquí esperamos que el cliente envíe los paths (file_path) en 'selected'
  // const selected = formData.getAll('selected') as string[];
  // if (!selected || selected.length === 0) {
  if (deletingKey) {
    return {
      status: 400,
      message: 'No se seleccionó ningún manual',
      data: null,
    };
  }


  /* const fileErrors: Array<{ path: string; error: any }> = [];
 
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
 */

  try {
    const response = await removeManualFile(deletingKey);
    if (response.error) throw Error(response.error, response.message);
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: 'El manual no pudo eliminarse',
      data: { err },
    };
  }



  return {
    status: 200,
    message: 'Archivos eliminados correctamente',
    data: null,
  };
}
