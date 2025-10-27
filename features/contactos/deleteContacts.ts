'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { deleteContactByIds } from './contactRepository';

export async function deleteContactsAction(
  formData: FormData
): Promise<Result> {
  const selected = formData.getAll('selected') as string[];
  if (!selected || selected.length === 0) {
    return {
      status: 400,
      message: 'No se seleccionó ningún contacto',
      data: null,
    };
  }
  const ids = selected.map((s) => (isNaN(Number(s)) ? s : Number(s)));

  try {
    const { error } = await deleteContactByIds(ids);
    if (error) {
      console.error('Error borrando Contacto:', error);
      return {
        status: 500,
        message: 'Error al eliminar contactos',
        data: null,
      };
    }
    return {
      status: 200,
      message: 'Contactos eliminados correctamente',
      data: null,
    };
  } catch (err) {
    console.error('Error inesperado en deleteContactsAction:', err);
    return {
      status: 500,
      message: 'Error inesperado en el servidor',
      data: null,
    };
  }
}
