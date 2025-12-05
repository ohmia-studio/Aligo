'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { r2 } from '@/lib/cloudflare/r2';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

const ACCOUNT = process.env.R2_ACCOUNT_ID;

type ResourceType = 'catalogs' | 'manuales';

function getBucketAndPrefix(resource: ResourceType) {
  // Ajustar nombres de bucket si los tenés separados en env
  const buckets: Record<ResourceType, string> = {
    catalogs:
      process.env.R2_BUCKET_CATALOGS ||
      process.env.R2_BUCKET_NAME ||
      'catalogs',
    manuales:
      process.env.R2_BUCKET_MANUALES ||
      process.env.R2_BUCKET_NAME ||
      'manuales',
  };
  const prefixes: Record<ResourceType, string> = {
    catalogs: 'catalogs/',
    manuales: 'manuales/',
  };
  return { bucket: buckets[resource], prefix: prefixes[resource] };
}

export async function uploadAction(formData: FormData): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    // acorde al patrón de tus actions: devolver objeto con success:false
    return { status: 401, message: 'Unauthorized', data: null };
  }

  try {
    const file = formData.get('file') as File;
    const prefix = formData.get('prefix') as ResourceType;
    if (!prefix || (prefix !== 'catalogs' && prefix !== 'manuales')) {
      return { status: 400, message: 'Prefijo no válido', data: null };
    }
    const { bucket } = getBucketAndPrefix(prefix);

    if (!file) {
      return {
        status: 404,
        message: 'No se recibió archivo',
        data: null,
      };
    }

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      return {
        status: 400,
        message: 'Solo se permiten archivos PDF',
        data: null,
      };
    }
    if (!prefix || (prefix !== 'catalogs' && prefix !== 'manuales')) {
      return {
        status: 400,
        message: 'Prefijo no válido',
        data: null,
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generar nombre único para el archivo usando el prefijo seleccionado
    const timestamp = Date.now();
    const fileName = `${prefix}/${timestamp}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: buffer,
      ContentType: 'application/pdf',
      // Forzar descarga directa cuando se acceda a la URL pública
      ContentDisposition: `attachment; filename="${file.name}"`,
    });

    await r2.send(command);

    const fileUrl = `https://${bucket}.${ACCOUNT}.r2.dev/${fileName}`;

    return {
      status: 200,
      message: `${prefix} subido: ${file.name}`,
      data: {
        url: fileUrl,
        fileName: fileName,
      },
    };
  } catch (err) {
    console.error(`Error al subir archivo`, err);
    return {
      status: 500,
      message: 'Error interno al subir el archivo',
      data: null,
    };
  }
}

export async function deleteAction(
  resource: ResourceType,
  key: string
): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    return { status: 401, message: 'Unauthorized', data: null };
  }

  try {
    // Validar que la key pertenece al prefijo esperado
    const { prefix } = getBucketAndPrefix(resource);
    if (!key || !key.startsWith(prefix)) {
      return {
        status: 400,
        message: 'Archivo no válido para eliminar',
        data: null,
      };
    }

    const { bucket } = getBucketAndPrefix(resource);
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await r2.send(command);

    return {
      status: 200,
      message: `${resource} eliminado correctamente`,
      data: null,
    };
  } catch (err) {
    console.error(`Error al eliminar archivo (${resource}):`, err);
    return { status: 500, message: 'Error al eliminar archivo', data: null };
  }
}

export async function listAction(resource: ResourceType): Promise<Result> {
  try {
    const { bucket, prefix } = getBucketAndPrefix(resource);
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 100,
    });

    const response = await r2.send(command);

    if (!response.Contents) {
      return resource === 'catalogs'
        ? { status: 200, message: 'OK', data: { catalogs: [] } }
        : { status: 200, message: 'OK', data: { manuals: [] } };
    }

    const items = response.Contents.filter(
      (item) => item.Key && item.Key !== prefix
    )
      .map((item) => {
        const fileName = item.Key!.replace(prefix, '');
        const originalName = fileName.substring(fileName.indexOf('-') + 1);
        const fileUrl = `https://${bucket}.${ACCOUNT}.r2.dev/${item.Key}`;

        return {
          id: item.Key!,
          name: originalName,
          fullKey: item.Key!,
          url: fileUrl,
          size: formatFileSize(item.Size || 0),
          lastModified:
            item.LastModified?.toISOString() || new Date().toISOString(),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );

    return resource === 'catalogs'
      ? { status: 200, message: 'OK', data: { catalogs: items } }
      : { status: 200, message: 'OK', data: { manuals: items } };
  } catch (err) {
    console.error(`Error al listar ${resource}:`, err);
    return { status: 500, message: 'Error al obtener la lista', data: null };
  }
}

// Función auxiliar para formatear el tamaño del archivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
