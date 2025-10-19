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
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: (file as any).type || 'application/pdf',
      // Forzar descarga como catálogo (igual que en features/catalogs/catalogs.ts)
      ContentDisposition: `attachment; filename="${(file as any).name ?? key}"`,
    });

    const resp = await r2.send(cmd);
    console.log('[uploadManualFile] uploaded', {
      key,
      bucket: BUCKET,
      httpStatus: resp?.$metadata?.httpStatusCode ?? null,
    });

    // Construir URL igual que en catalogs.ts
    const fileUrl = `https://${BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;

    return ok({ path: key, url: fileUrl });
  } catch (err: any) {
    console.error('[uploadManualFile] error uploading to R2:', {
      message: err?.message ?? err,
      code: err?.Code ?? err?.code ?? null,
      httpStatus: err?.$metadata?.httpStatusCode ?? null,
    });
    return fail(err);
  }
}

export async function removeManualFile(path: string) {
  try {
    const BUCKET =
      process.env.R2_BUCKET_MANUALES ||
      process.env.R2_BUCKET_NAME ||
      'catalogos';
    const PREFIX = process.env.R2_MANUALES_PREFIX ?? 'manuales/';

    // Validar que la key pertenezca al prefijo esperado
    if (!path.startsWith(PREFIX)) {
      return fail({ message: 'Archivo no válido para eliminar' }, 400);
    }

    const cmd = new DeleteObjectCommand({ Bucket: BUCKET, Key: path });
    await r2.send(cmd);

    return ok({ message: 'Archivo eliminado correctamente' });
  } catch (err: any) {
    console.error('[removeManualFile] error:', err);
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
