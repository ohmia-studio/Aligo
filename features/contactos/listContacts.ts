'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { getContacts } from './contactRepository';

export async function listContactsAction(): Promise<Result> {
  try {
    const auth = await requireServerAuth({ allowedRoles: 'admin' });
    if (!auth.ok) {
      // acorde al patrón de tus actions: devolver objeto con success:false
      return { status: 401, message: 'Unauthorized', data: null };
    }
    const res = await getContacts();
    if (res.error) return { status: 500, message: res.message, data: null };
    return { status: 200, message: res.message ?? '', data: res.data };
  } catch (err) {
    console.error('Error listContactsAction:', err);
    return { status: 500, message: 'Error inesperado', data: null };
  }
}
