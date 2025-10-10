'use server';

import { deleteImagesOnError } from "@/features/news/news";

export async function deleteNewsImagesAction(payload: string) {

    // Ejecuta la lógica de negocio (usa supabaseAdmin dentro)
    const result = await deleteImagesOnError(payload);

    if (result.status !== 200) {
        throw new Error(result.message || 'failed to delete news images');
    }

    // Devuelve datos útiles al cliente (ej. el registro creado)
    return result.data;
}