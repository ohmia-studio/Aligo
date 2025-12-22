'use server';

import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';

/**
 * Repositorio delgado: ejecuta llamadas a Supabase y devuelve
 * { data, error, status, message } para que las actions manejen la lógica.
 */

/* Helpers */
function ok(data: any) {
  return { data, error: null, status: 200, message: null };
}
function fail(error: any, status = 500) {
  const message = error?.message ?? String(error);
  return { data: null, error, status, message };
}

/* Exports */

export async function getWorkers() {
  try {
    const supabase = await getSupabaseServer();
    const resp = await supabase
      .from('Persona')
      .select('*')
      .eq('rol', 'empleado');
    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function getAllPersonasEmails() {
  try {
    const resp = await supabaseAdmin
      .from('Persona')
      .select('email, nombre, apellido');
    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function findPersonaByDniOrEmail(dni: string, email: string) {
  try {
    const resp = await supabaseAdmin
      .from('Persona')
      .select('id, dni, email, auth_id')
      .or(`dni.eq.${dni},email.eq.${email}`)
      .limit(1)
      .maybeSingle();

    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function createAuthUser(payload: {
  email: string;
  password: string;
  user_metadata?: Record<string, any>;
}) {
  try {
    const resp = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      user_metadata: payload.user_metadata,
      email_confirm: true,
    });
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? resp);
  } catch (err) {
    return fail(err);
  }
}

export async function deleteAuthUser(authId: string) {
  try {
    const resp = await supabaseAdmin.auth.admin.deleteUser(authId);
    if ((resp as any).error) return fail((resp as any).error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

export async function insertPersona(row: Record<string, any>) {
  try {
    const resp = await supabaseAdmin.from('Persona').insert([row]);
    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function getPersonAuthIdsByIds(ids: Array<string | number>) {
  try {
    const supabase = await getSupabaseServer();
    const resp = await supabase
      .from('Persona')
      .select('id, auth_id')
      .in('id', ids);
    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function deletePersonaByIds(ids: Array<string | number>) {
  try {
    const resp = await supabaseAdmin.from('Persona').delete().in('id', ids);
    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function findPersonaById(id: string | number) {
  try {
    const resp = await supabaseAdmin
      .from('Persona')
      .select('id, dni, nombre, apellido, email, telefono, auth_id')
      .eq('id', id)
      .maybeSingle();

    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function findPersonaByEmailExcludingId(
  email: string,
  excludeId: string | number
) {
  try {
    const resp = await supabaseAdmin
      .from('Persona')
      .select('id')
      .eq('email', email)
      .neq('id', excludeId)
      .limit(1)
      .maybeSingle();

    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function updatePersonaById(
  id: string | number,
  data: { nombre: string; apellido: string; email: string; telefono: string }
) {
  try {
    const resp = await supabaseAdmin
      .from('Persona')
      .update({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
      })
      .eq('id', id);

    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function updateAuthUser(
  authId: string,
  payload: { email: string; user_metadata: Record<string, any> }
) {
  try {
    const resp = await supabaseAdmin.auth.admin.updateUserById(authId, {
      email: payload.email,
      user_metadata: payload.user_metadata,
    });
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? resp);
  } catch (err) {
    return fail(err);
  }
}
