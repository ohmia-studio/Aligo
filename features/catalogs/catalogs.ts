'use server';
import { Result } from '@/interfaces/server-response-interfaces';
import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { r2 } from '@/lib/cloudflare/r2';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

export async function uploadCatalogAction(formData: FormData): Promise<Result> {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    // acorde al patrón de tus actions: devolver objeto con success:false
    return { status: 401, message: 'Unauthorized', data: null };
  }
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return {
        status: 404,
        message: 'No se recibió archivo',
        data: null
      };
    }

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      return {
        status: 400,
        message: 'Solo se permiten archivos PDF',
        data: null
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `catalogs/${timestamp}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'application/pdf',
      // Forzar descarga directa cuando se acceda a la URL pública
      ContentDisposition: `attachment; filename="${file.name}"`,
    });

    await r2.send(command);

    const fileUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev/${fileName}`;

    return {
      status: 200,
      message: `Catálogo subido: ${file.name}`,
      data: {
        url: fileUrl,
        fileName: fileName
      }
    };

  } catch (err) {
    console.error('Error al subir catálogo:', err);
    return {
      status: 500,
      message: 'Error interno al subir el archivo',
      data: null
    };
  }
}

export async function listCatalogs() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: 'catalogs/', // Solo archivos en la carpeta catalogs
      MaxKeys: 100, // Limitar resultados
    });

    const response = await r2.send(command);

    if (!response.Contents) {
      return {
        success: true,
        catalogs: [],
      };
    }

    const catalogs = response.Contents.filter(
      (item) => item.Key && item.Key !== 'catalogs/'
    ) // Excluir carpeta vacía
      .map((item) => {
        const fileName = item.Key!.replace('catalogs/', ''); // Remover prefijo
        const originalName = fileName.substring(fileName.indexOf('-') + 1); // Remover timestamp
        const fileUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev/${item.Key}`;

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
      ); // Más recientes primero

    return {
      success: true,
      catalogs,
    };
  } catch (err) {
    console.error('Error al listar catálogos:', err);
    return {
      success: false,
      error: 'Error al obtener la lista de catálogos',
      catalogs: [],
    };
  }
}

export async function deleteCatalog(catalogKey: string) {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) {
    // acorde al patrón de tus actions: devolver objeto con success:false
    return { status: 401, message: 'Unauthorized', data: null };
  }
  try {
    // Validar que la key pertenece a la carpeta catalogs
    if (!catalogKey.startsWith('catalogs/')) {
      return {
        status: 400,
        message: 'Archivo no válido para eliminar',
        data: null
      };
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: catalogKey,
    });

    await r2.send(command);

    return {
      status: 200,
      message: 'Catálogo eliminado correctamente',
      data: null
    };
  } catch (err) {
    console.error('Error al eliminar catálogo:', err);
    return {
      status: 200,
      message: 'Error al eliminar catálogo',
      data: err
    };
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
