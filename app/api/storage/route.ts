import { withAuth } from '@/lib/auth/withAuth';
import { r2 } from '@/lib/cloudflare/r2';
import { stripTimestamp } from '@/lib/utils';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * API Route para descargar/visualizar archivos desde Cloudflare R2
 * Soporta claves que empiezan con `catalogs/` o `manuales/`.
 */
export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get('key');
      const name = searchParams.get('name') || undefined;
      const view = searchParams.get('view');
      const dispositionParam = searchParams.get('disposition'); // inline | attachment

      if (!key || typeof key !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Parámetro key inválido' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Validar que la key pertenezca a catalogs/ o manuales/
      if (!key.startsWith('catalogs/') && !key.startsWith('manuales/')) {
        console.log('Error: Key inválida:', key);
        return new Response(
          JSON.stringify({ error: 'Parámetro key inválido' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const bucket = key.startsWith('manuales/')
        ? process.env.R2_BUCKET_MANUALES || process.env.R2_BUCKET_NAME
        : process.env.R2_BUCKET_NAME;

      const result = await r2.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );

      // Nombre para el archivo (sin timestamp si viene en el key)
      const rawName = name || key.split('/').pop() || 'archivo.pdf';
      const fileName = stripTimestamp(rawName);

      // Configurar headers
      const headers = new Headers();

      const inline = view === 'true' || dispositionParam === 'inline';

      if (inline) {
        headers.set(
          'Content-Disposition',
          `inline; filename="${encodeURIComponent(fileName)}"`
        );
      } else {
        headers.set(
          'Content-Disposition',
          `attachment; filename="${encodeURIComponent(fileName)}"`
        );
      }

      headers.set('Content-Type', result.ContentType || 'application/pdf');
      if (result.ContentLength)
        headers.set('Content-Length', String(result.ContentLength));
      headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
      headers.set('X-Frame-Options', 'SAMEORIGIN');
      headers.set('Access-Control-Allow-Origin', '*');

      return new Response(result.Body as any, {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error('Error en descarga de archivo (storage):', error);

      const errorDetails = {
        error: 'Error al descargar el archivo',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        environment: {
          bucketName: process.env.R2_BUCKET_NAME ? 'Set' : 'Missing',
          manualsBucket: process.env.R2_BUCKET_MANUALES ? 'Set' : 'Missing',
          accountId: process.env.R2_ACCOUNT_ID ? 'Set' : 'Missing',
        },
      };

      return new Response(JSON.stringify(errorDetails), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { roles: ['admin', 'empleado'] }
);
