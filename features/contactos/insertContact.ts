'use server';

import { Result } from '@/interfaces/server-response-interfaces';
import { insertContact } from './contactRepository';

export async function insertContactAction(payload: {
  nombre: string;
  telefono?: string;
  email?: string;
}): Promise<Result> {
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
