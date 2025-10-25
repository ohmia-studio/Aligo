'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { getContacts } from './contactRepository';

export async function listContactsAction(): Promise<Result> {
  try {
    const res = await getContacts();
    if (res.error) return { status: 500, message: res.message, data: null };
    return { status: 200, message: res.message ?? '', data: res.data };
  } catch (err) {
    console.error('Error listContactsAction:', err);
    return { status: 500, message: 'Error inesperado', data: null };
  }
}
