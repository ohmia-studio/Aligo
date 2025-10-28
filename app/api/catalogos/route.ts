import { r2 } from '@/lib/claudflare/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * API Route para descargar catálogos desde Cloudflare R2
 * GET /api/catalogos?key=catalogs/archivo.pdf&name=NombreArchivo.pdf
 */
export async function GET(req: NextRequest) {
  try {
    // Extraer parámetros de la URL
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key'); // Ruta completa del archivo en R2
    const name = searchParams.get('name') || undefined; // Nombre para la descarga
    const view = searchParams.get('view'); // Si es 'true', permitir visualización en línea

    // Validar que la key sea válida y de la carpeta catalogs
    if (!key || !key.startsWith('catalogs/')) {
      console.log('Error: Key inválida:', key);
      return new Response(JSON.stringify({ error: 'Parámetro key inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );

    // Configurar nombre del archivo para la descarga
    const fileName = name || key.split('/').pop() || 'catalogo.pdf';

    // Configurar headers
    const headers = new Headers();

    // Si view=true, permitir visualización en línea, sino forzar descarga
    if (view === 'true') {
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
    if (result.ContentLength) {
      headers.set('Content-Length', String(result.ContentLength));
    }
    headers.set('Cache-Control', 'private, max-age=0, must-revalidate');

    // Headers para permitir visualización en iframe/embed
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Access-Control-Allow-Origin', '*');

    // Devolver el archivo como stream para descarga
    return new Response(result.Body as any, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error en descarga de catálogo:', error);

    // Proporcionar más información de debugging
    const errorDetails = {
      error: 'Error al descargar el archivo',
      details: error instanceof Error ? error.message : 'Error desconocido',
      key: req.url,
      timestamp: new Date().toISOString(),
      environment: {
        bucketName: process.env.R2_BUCKET_NAME ? 'Set' : 'Missing',
        accountId: process.env.R2_ACCOUNT_ID ? 'Set' : 'Missing',
      },
    };

    return new Response(JSON.stringify(errorDetails), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
