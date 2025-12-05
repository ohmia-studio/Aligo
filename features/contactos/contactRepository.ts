'use server';
import { supabaseAdmin as supabase } from '../../lib/supabase/supabaseAdmin';

export async function updateContact(row: {
  id: string | number;
  nombre: string;
  telefono?: string;
  email?: string;
}) {
  try {
    const resp = await supabase
      .from('Contacto')
      .update({
        nombre: row.nombre,
        telefono: row.telefono,
        email: row.email,
      })
      .eq('id', row.id)
      .select('id, nombre, telefono, email')
      .maybeSingle();
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? null);
  } catch (err) {
    return fail(err);
  }
}
/**
 * Obtener un contacto por id
 */
export async function getContactById(id: string | number) {
  try {
    const resp = await supabase
      .from('Contacto')
      .select('id, nombre, telefono, email')
      .eq('id', id)
      .maybeSingle();
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? null);
  } catch (err) {
    return fail(err);
  }
}

function ok(data: any) {
  return { data, error: null, status: 200, message: '' };
}
function fail(error: any, status = 500) {
  const message =
    typeof error === 'string' ? error : (error?.message ?? String(error));
  return { data: null, error, status, message };
}

/**
 * Contactos repository — usa solo supabaseAdmin (server)
 * Campos esperados en la tabla `Contacto`: id, nombre, telefono, email
 */
export async function getContacts() {
  try {
    const resp = await supabase
      .from('Contacto')
      .select('id, nombre, telefono, email')
      .order('id', { ascending: false });

    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function insertContact(row: {
  nombre: string;
  telefono?: string;
  email?: string;
}) {
  try {
    // insert and return the inserted row
    const resp = await supabase
      .from('Contacto')
      .insert([row])
      .select('id, nombre, telefono, email')
      .maybeSingle();
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function deleteContactByIds(ids: Array<string | number>) {
  try {
    const resp = await supabase
      .from('Contacto')
      .delete()
      .in('id', ids)
      .select('id');
    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}
