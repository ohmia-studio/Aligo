export const runtime = 'nodejs';

import { withAuth } from '@/lib/auth/withAuth';
import { r2 } from '@/lib/cloudflare/r2';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export const GET = withAuth(
  async (req: Request) => {
    try {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get('key');
      const name = searchParams.get('name') || key;

      const BUCKET =
        process.env.R2_BUCKET_MANUALES ||
        process.env.R2_BUCKET_NAME ||
        'catalogos';

      // Si se pasó key => devolver el objeto (descarga o visualización)
      if (key) {
        const view = searchParams.get('view'); // Si es 'true', permitir visualización en línea

        const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const resp = await r2.send(cmd);

        const body: any = (resp as any).Body;
        const headers = new Headers();

        // Configurar Content-Type
        headers.set(
          'Content-Type',
          (resp as any).ContentType || 'application/pdf'
        );

        if ((resp as any).ContentLength)
          headers.set('Content-Length', String((resp as any).ContentLength));

        // Si view=true, permitir visualización en línea, sino forzar descarga
        if (view === 'true') {
          headers.set(
            'Content-Disposition',
            `inline; filename="${encodeURIComponent(name || key)}"`
          );
        } else {
          headers.set(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(name || key)}"`
          );
        }

        // Headers para permitir visualización en iframe/embed
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'private, max-age=0, must-revalidate');

        return new Response(body as any, { headers });
      }

      // Si no hay key => listar manuales
      const PREFIX = process.env.R2_MANUALES_PREFIX ?? 'manuales/';
      const cmdList = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: PREFIX,
        MaxKeys: 1000,
      });
      const listResp = await r2.send(cmdList);
      const contents = listResp.Contents ?? [];

      const account = process.env.R2_ACCOUNT_ID;
      const base = process.env.NEXT_PUBLIC_R2_URL
        ? process.env.NEXT_PUBLIC_R2_URL.replace(/\/$/, '')
        : account
          ? `https://${BUCKET}.${account}.r2.dev`
          : `https://${BUCKET}.r2.dev`;

      const manuals = contents.map((c) => {
        const key = c.Key ?? '';
        const fileName = key.split('/').pop() ?? key;
        return {
          name: fileName,
          fullKey: key,
          url: `${base}/${encodeURIComponent(key)}`,
          size: c.Size?.toString() ?? '', // TODO: hotfix para poder juntar con catalogo...
          lastModified: c.LastModified ?? new Date(),
        };
      });

      return NextResponse.json({ manuals }, { status: 200 });
    } catch (err: any) {
      console.error('API /api/manuales error:', err);
      return NextResponse.json(
        { error: err?.message || 'Error en endpoint /api/manuales' },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'empleado'] }
);
