'use client';

export function triggerDownload(key: string, name?: string, view = false) {
  const encodedKey = encodeURIComponent(key);
  const encodedName = encodeURIComponent(
    name || key.split('/').pop() || 'archivo.pdf'
  );
  const url = `/api/storage?key=${encodedKey}&name=${encodedName}${view ? '&view=true' : ''}`;
  window.location.href = url;
}

// Sube un archivo PDF a Cloudflare R2 usando presigned URL
import { Result } from '@/interfaces/server-response-interfaces';

export async function uploadToR2Direct(
  file: File,
  resource: 'catalogs' | 'manuales'
): Promise<Result> {
  try {
    // 1. Pedir presigned URL al backend
    const presignRes = await fetch('/api/storage/presign-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        resource,
        contentType: file.type,
      }),
    });
    if (!presignRes.ok) {
      return {
        status: presignRes.status,
        message: 'No se pudo obtener URL de subida',
        data: null,
      };
    }
    const { url, key, fileUrl } = await presignRes.json();

    // 2. Subir el archivo directamente a R2
    const uploadRes = await fetch(url, {
      method: 'PUT',
      body: file,
    });

    if (!uploadRes.ok) {
      console.error(
        'Error al subir a R2:',
        uploadRes.status,
        await uploadRes.text()
      );
      return {
        status: uploadRes.status,
        message: 'Error al subir a R2',
        data: null,
      };
    }

    // 3. Retornar la URL que viene del backend
    return {
      status: 200,
      message: `${resource} subido: ${file.name}`,
      data: {
        url: fileUrl,
        fileName: key,
      },
    };
  } catch (err) {
    console.error('Error en subida directa a R2:', err);
    return {
      status: 500,
      message: 'Error inesperado en subida directa',
      data: null,
    };
  }
}
