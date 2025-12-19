import { getBucketAndPrefix } from '@/features/storage/storage';
import { withAuth } from '@/lib/auth/withAuth';
import { r2 } from '@/lib/cloudflare/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function sanitizeFileName(fileName: string): string {
  // Eliminar path traversal y caracteres peligrosos
  return fileName
    .replace(/\.\./g, '') // Eliminar ../
    .replace(/[\/\\]/g, '') // Eliminar / y \
    .replace(/[^a-zA-Z0-9._-\s]/g, '') // Solo alfanuméricos, punto, guion, espacio
    .replace(/\s+/g, '_') // Reemplazar espacios por _
    .trim()
    .slice(0, 200); // Limitar longitud
}

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const { fileName, resource, contentType } = await req.json();
      if (
        !fileName ||
        !resource ||
        !['catalogs', 'manuales'].includes(resource)
      ) {
        return NextResponse.json(
          { error: 'Parámetros inválidos' },
          { status: 400 }
        );
      }

      const { bucket, prefix } = await getBucketAndPrefix(resource);
      const sanitizedName = sanitizeFileName(fileName);
      const key = `${prefix}${Date.now()}-${sanitizedName}`;

      const url = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: contentType || 'application/pdf',
        }),
        { expiresIn: 3600 }
      );

      const account = process.env.R2_ACCOUNT_ID;
      const fileUrl = `https://${bucket}.${account}.r2.dev/${key}`;

      return NextResponse.json({ url, key, fileUrl });
    } catch (err) {
      console.error('Error generando presigned URL:', err);
      return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
  },
  { roles: ['admin'] }
);
