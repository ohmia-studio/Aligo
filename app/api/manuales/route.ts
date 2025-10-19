export const runtime = 'nodejs';

import { r2 } from '@/lib/claudflare/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BUCKET = process.env.R2_BUCKET_MANUALES || 'catalogos';
    // prefijo donde guardás manuales dentro del bucket (si guardás en carpeta)
    const PREFIX = process.env.R2_MANUALES_PREFIX ?? 'manuales/';

    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
      MaxKeys: 1000,
    });

    const resp = await r2.send(cmd);
    const contents = resp.Contents ?? [];

    const account = process.env.R2_ACCOUNT_ID;
    // construir URL similar a la usada en uploads (ajustá si usás otro patrón)
    const base = process.env.NEXT_PUBLIC_R2_URL
      ? process.env.NEXT_PUBLIC_R2_URL.replace(/\/$/, '')
      : account
        ? `https://${BUCKET}.${account}.r2.dev`
        : `https://${BUCKET}.r2.dev`;

    const manuals = contents.map((c) => {
      const key = c.Key ?? '';
      const fileName = key.split('/').pop() ?? key;
      return {
        key,
        file_name: fileName,
        size: c.Size ?? 0,
        lastModified: c.LastModified ?? null,
        url: `${base}/${encodeURIComponent(key)}`,
      };
    });

    return NextResponse.json({ manuals }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/manuales GET error:', err);
    return NextResponse.json(
      { error: { message: err?.message ?? 'Error listando manuales' } },
      { status: 500 }
    );
  }
}
