'use server';

import { TagItem } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';

export async function retrieveTags(): Promise<Result> {
    try {

        let { data: Tag, error } = await supabaseAdmin
            .from('Tag')
            .select('nombre, descripcion');


        if (error) {
            return { status: 500, message: error.message, data: null };
        }
        return { status: 200, message: 'ok', data: Tag };
    } catch (err: any) {
        console.error('Error en retrieveNews:', err);
        return { status: 500, message: err?.message || 'unexpected error', data: null };
    }
}

export async function createTagAction(tag: TagItem) {
    const { data, error } = await supabaseAdmin
        .from('Tag')
        .insert([tag])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}