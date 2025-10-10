'use server';

import { deleteNew } from "@/features/news/news";
import { newsStorageFolderSnakeCase } from "@/lib/storageStringCase";
import { revalidatePath } from 'next/cache';

interface NewKey {
    title: string,
    uploadDate: Date
}

export async function deleteNewsAction(payload: NewKey) {

    const folder = newsStorageFolderSnakeCase(payload.title, payload.uploadDate);

    // Ejecuta la lógica de negocio (usa supabaseAdmin dentro)
    const result = await deleteNew(payload.title, payload.uploadDate, folder);

    if (result.status !== 200) {
        throw new Error(result.message || 'failed to delete news images');
    }

    revalidatePath('/news');

    // Devuelve datos útiles al cliente (ej. el registro creado)
    return result.data;
}