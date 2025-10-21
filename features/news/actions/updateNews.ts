'use server';

import { UpdateNewsInput } from '@/interfaces/news-interfaces';
import { revalidatePath } from 'next/cache';
import { updateNew } from '../news';
import { deleteNewsImagesAction } from './deleteNewsImages';

export async function updateNewsAction(payload: UpdateNewsInput) {
    // Validaciones básicas (server-side)
    if (!payload || !payload.titulo || !payload.descripcion) {
        // Lanzar error para que el cliente lo capture
        throw new Error('title and description are required');
    }

    // Meterme en la carpeta con el antiguo titulo y cambiarlo por el nuevo.
    // Tener en cuenta que el titulo de la carpeta esta en camel case
    const result = await updateNew({
        antiguoTitulo: payload.antiguoTitulo,
        titulo: payload.titulo,
        tag: payload.tag ?? null,
        descripcion: JSON.parse(payload.descripcion),
        bucket_folder_url: payload.bucket_folder_url,
        created_at: payload.created_at,
        removedImageUrls: payload.removedImageUrls
    });

    if (result.status !== 200) {
        if (payload.bucket_folder_url)
            await deleteNewsImagesAction(payload.bucket_folder_url); // TODO: queda implementar correctamente una clase para los errores y testear esto.

        throw new Error('Error al actualizar la novedad || ' + result.message);
    }

    // Revalida la ruta /news en el servidor para que las páginas SSR actualicen su cache
    revalidatePath('/news');

    // Devuelve datos útiles al cliente (ej. el registro creado)
    return result.data;


}
