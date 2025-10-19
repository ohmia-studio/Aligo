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
    const resp = await supabaseAdmin.auth.admin.createUser(payload);
    if ((resp as any).error) return fail((resp as any).error);
    return ok((resp as any).data ?? resp);
  } catch (err) {
    return fail(err);
  }
}

export async function deleteAuthUser(authId: string) {
  try {
    const resp = await supabaseAdmin.auth.admin.deleteUser(authId);
    // supabase-admin returns { error } on failure
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
