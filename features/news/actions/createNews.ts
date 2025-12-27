'use server';
// app/actions/news/createNews.ts
import { uploadNew } from '@/features/news/news';
import { New } from '@/interfaces/news-interfaces';
import { notifyNewsUpdate } from '@/lib/emailService';
import { revalidatePath } from 'next/cache';
import { deleteNewsImagesAction } from './deleteNewsImages';

export async function createNewsAction(payload: New) {
  // Validaciones básicas (server-side)
  if (!payload || !payload.titulo || !payload.descripcion) {
    // Lanzar error para que el cliente lo capture
    throw new Error('title and description are required');
  }

  // Ejecuta la lógica de negocio (usa supabaseAdmin dentro)
  const result = await uploadNew({
    created_at: payload.created_at,
    titulo: payload.titulo,
    descripcion: JSON.parse(payload.descripcion),
    tag: payload.tag ?? null,
    bucket_folder_url: payload.bucket_folder_url,
  });

  if (result.status !== 200) {
    if (payload.bucket_folder_url)
      await deleteNewsImagesAction(payload.bucket_folder_url); // TODO: queda implementar correctamente una clase para los errores y testear esto.

    throw new Error('Error al crear novedad' + result.message);
  }

  // Revalida la ruta /news en el servidor para que las páginas SSR actualicen su cache
  revalidatePath('/news');

  // Enviar notificaciones en background SIN esperar
  notifyNewsUpdate({ titulo: payload.titulo, tipo: 'creada' }).catch(
    (error) => {
      console.error(
        '[createNews] Error en notificaciones (background):',
        error
      );
    }
  );

  // Devuelve datos útiles al cliente (ej. el registro creado)
  return result.data;
}
