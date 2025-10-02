'use server';
// features/news/news.ts
import { New } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';

export async function deleteImagesOnError(path: string): Promise<Result> {
    try {
        const { data, error } = await supabaseAdmin.storage.from('Novedades').remove([path]);

        if (error) throw error;
        return { status: 200, message: "Imagenes eliminadas correctamente", data: data };

    } catch (err: any) {
        console.error('Error en deleteImagesOnError:', err);
        return { status: 500, message: err?.message || 'unexpected error', data: null };
    }
};


export async function uploadNewImage(folderName: string, imageName: string, file: File): Promise<Result> {
    try {
        const { data, error } = await supabaseAdmin.storage.from('Novedades').upload(`${folderName}/${imageName}`, file, { upsert: false });

        if (error) throw error;

        // Obtener URL pública
        const { data: publicUrl } = supabaseAdmin.storage
            .from('Novedades')
            .getPublicUrl(folderName);

        return { status: 200, message: "Imagenes subidas correctamente", data: publicUrl.publicUrl };
    } catch (err: any) {
        console.error('Error en uploadNewImage:', err);
        return { status: 500, message: err?.message || 'unexpected error', data: null };
    }
};

/**
 * Inserta una nueva novedad en la tabla 'Novedad'
 * - Genera un slug a partir del title
 * - Usa el ID generado por la DB como carpeta única en el bucket
 */
export async function uploadNew({
    created_at,
    titulo,
    descripcion,
    tag,
    bucket_folder_url
}: New): Promise<Result> {
    try {
        if (!titulo || !descripcion) {
            return { status: 400, message: 'title and description required', data: null };
        }

        const { data: newData, error: newError } = await supabaseAdmin
            .from('Novedad')
            .insert([
                {
                    created_at: created_at.toISOString(),
                    titulo: titulo,
                    descripcion: descripcion, // JSON
                    tag: tag ?? null,
                    bucket_folder_url
                },
            ])
            .select()
            .single();

        if (newError) {
            return { status: 500, message: newError.message, data: null };
        }

        return { status: 200, message: 'New created', data: newData };
    } catch (err: any) {
        console.error('Error en uploadNew:', err);
        return { status: 500, message: err?.message || 'unexpected error', data: null };
    }
}

export async function retrieveNews(): Promise<Result> {
    try {
        const { data: newData, error: newError } = await supabaseAdmin
            .from('Novedad')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(7);

        if (newError) {
            return { status: 500, message: newError.message, data: null };
        }
        return { status: 200, message: 'ok', data: newData };
    } catch (err: any) {
        console.error('Error en retrieveNews:', err);
        return { status: 500, message: err?.message || 'unexpected error', data: null };
    }
}
