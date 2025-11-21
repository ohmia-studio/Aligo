'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { insertContact } from './contactRepository';

export async function insertContactAction(payload: {
  nombre: string;
  telefono?: string;
  email?: string;
}): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    // acorde al patrón de tus actions: devolver objeto con success:false
    return { status: 401, message: 'Unauthorized', data: null };
  }
  try {
    const { data, error, status, message } = await insertContact(
      payload as any
    );
    if (error)
      return { status: status || 500, message: message ?? 'Error', data: null };
    return { status: 200, message: 'Contacto creado', data };
  } catch (err) {
    console.error('Error insertContactAction', err);
    return { status: 500, message: 'Error inesperado', data: null };
  }
}
