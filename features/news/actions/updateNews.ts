'use server';

import { UpdateNewsInput } from '@/interfaces/news-interfaces';
import { notifyNewsUpdate } from '@/lib/emailService';
import { revalidatePath } from 'next/cache';
import { updateNew } from '../news';
import { deleteNewsImagesAction } from './deleteNewsImages';

export async function updateNewsAction(payload: UpdateNewsInput) {
  if (!payload || !payload.titulo || !payload.descripcion) {
    throw new Error('title and description are required');
  }

  const result = await updateNew({
    antiguoTitulo: payload.antiguoTitulo,
    titulo: payload.titulo,
    tag: payload.tag ?? null,
    descripcion: JSON.parse(payload.descripcion),
    bucket_folder_url: payload.bucket_folder_url,
    created_at: payload.created_at,
    removedImageUrls: payload.removedImageUrls,
  });

  if (result.status !== 200) {
    if (payload.bucket_folder_url)
      await deleteNewsImagesAction(payload.bucket_folder_url);
    throw new Error('Error al actualizar la novedad || ' + result.message);
  }

  revalidatePath('/news');

  // Enviar notificaciones en background SIN esperar
  notifyNewsUpdate({ titulo: payload.titulo, tipo: 'actualizada' }).catch(
    (error) => {
      console.error(
        '[updateNews] Error en notificaciones (background):',
        error
      );
    }
  );

  return result.data;
}
