'use server';

import { r2 } from '@/lib/claudflare/r2';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

const BUCKET = process.env.R2_BUCKET_MANUALES || 'manuales';

function ok(data: any) {
  return { data, error: null, status: 200, message: null };
}
function fail(error: any, status = 500) {
  return {
    data: null,
    error,
    status,
    message: error?.message ?? String(error),
  };
}

export async function getManuals() {
  try {
    const resp = await supabaseAdmin
      .from('Manual')
      .select('*')
      .order('created_at', { ascending: false });
    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function getManualsByIds(ids: Array<string | number>) {
  try {
    const resp = await supabaseAdmin.from('Manual').select('*').in('id', ids);
    if (resp.error) return fail(resp.error);
    return ok(Array.isArray(resp.data) ? resp.data : []);
  } catch (err) {
    return fail(err);
  }
}

export async function uploadManualFile(key: string, file: File | Blob) {
  try {
    // seguridad: validar tamaño/type si hace falta
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: (file as any).type || 'application/pdf',
    });

    const resp = await r2.send(cmd);
    // r2 response no lanza error si ok; pero lo logueamos
    console.log('[uploadManualFile] uploaded', {
      key,
      bucket: BUCKET,
      resp: !!resp,
    });

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL?.replace(/\/$/, '')}/${BUCKET}/${encodeURI(key)}`;
    return ok({ path: key, url: publicUrl });
  } catch (err: any) {
    console.error(
      '[uploadManualFile] error uploading to R2:',
      err?.message ?? err
    );
    return fail(err);
  }
}

export async function removeManualFile(path: string) {
  try {
    const cmd = new DeleteObjectCommand({ Bucket: BUCKET, Key: path });
    await r2.send(cmd);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

export async function createManualRow(row: Record<string, any>) {
  try {
    const resp = await supabaseAdmin.from('Manual').insert([row]);
    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}

export async function deleteManualRowByIds(ids: Array<string | number>) {
  try {
    const resp = await supabaseAdmin.from('Manual').delete().in('id', ids);
    if (resp.error) return fail(resp.error);
    return ok(resp.data ?? null);
  } catch (err) {
    return fail(err);
  }
}
