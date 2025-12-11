'use server';
// features/news/news.ts
import { New, UpdateNewsInput } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { sanitizeForStorage } from '@/lib/storageStringCase';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';

// Por alguna razon el uploadDate (y siempre que recibo desde la BD la fecha, la recibo en String, por más de que esté el tipo de Date o TimeStamp)
export async function deleteNew(
  title: string,
  uploadDate: Date,
  folder: string
) {
  const supabaseServer = await getSupabaseServer();
  try {
    const { data, error } = await supabaseServer
      .from('Novedad')
      .delete()
      .eq('titulo', title)
      .eq('created_at', uploadDate);
    if (error) throw error;

    const { data: files, error: listError } = await supabaseServer.storage
      .from('Novedades')
      .list(folder, { limit: 100 });

    if (listError) throw listError;

    if (files && files.length > 0) {
      // Obtener todos los archivos de la carpeta del bucket. No se puede eliminar llamando unicamente a la carpeta
      // ya que no existe una carpeta en si, sino que es una forma visual de mostrar rutas de archivos ordenados.
      const paths = files.map((f) => `${folder}/${f.name}`);
      const { error: removeError } = await supabaseServer.storage
        .from('Novedades')
        .remove(paths);

      if (removeError) throw removeError;
    }

    return {
      status: 200,
      message: 'Novedad eliminada correctamente',
      data: null,
    };
  } catch (err: any) {
    console.error('Error en deleteNew', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error in deleteNew',
      data: null,
    };
  }
}

export async function deleteImagesOnError(path: string): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const { data, error } = await supabaseServer.storage
      .from('Novedades')
      .remove([path]);

    if (error) throw error;
    return {
      status: 200,
      message: 'Imagenes eliminadas correctamente',
      data: data,
    };
  } catch (err: any) {
    console.error('Error en deleteImagesOnError:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}

// COMO OBTENGO LAS URL DE LAS IMAGENES ELIMINADAS?
export async function deleteUnusedImage(
  folder: string,
  removedImageUrls: string[]
) {
  const supabaseServer = await getSupabaseServer();

  const { error } = await supabaseServer.storage
    .from('Novedades')
    .remove(removedImageUrls);
  if (error) throw error;
}

export async function moveExistingImage(
  oldUrl: string,
  newUrl: string,
  fileName: string
): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const sanitizedOldUrl = sanitizeForStorage(oldUrl);
    const sanitizedNewUrl = sanitizeForStorage(newUrl);
    const sanitizedFileName = sanitizeForStorage(fileName);

    const { data, error } = await supabaseServer.storage
      .from('Novedades')
      .move(
        sanitizedOldUrl.concat('/', sanitizedFileName),
        sanitizedNewUrl.concat('/', sanitizedFileName)
      );

    if (error) throw error;

    const { data: publicUrl } = supabaseServer.storage
      .from('Novedades')
      .getPublicUrl(sanitizedNewUrl);

    return {
      status: 200,
      message: 'Imagenes subidas correctamente',
      data: publicUrl.publicUrl,
    };
  } catch (err: any) {
    console.error('Error en moveExistingImage:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}

export async function uploadNewImage(
  folderName: string,
  imageName: string,
  file: File
): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const sanitizedFolder = sanitizeForStorage(folderName);
    const sanitizedImage = sanitizeForStorage(imageName);

    const { data, error } = await supabaseServer.storage
      .from('Novedades')
      .upload(`${sanitizedFolder}/${sanitizedImage}`, file, { upsert: false });

    if (error) throw error;

    // Obtener URL pública
    const { data: publicUrl } = supabaseServer.storage
      .from('Novedades')
      .getPublicUrl(sanitizedFolder);

    return {
      status: 200,
      message: 'Imagenes subidas correctamente',
      data: publicUrl.publicUrl,
    };
  } catch (err: any) {
    console.error('Error en uploadNewImage:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}

export async function updateNew({
  antiguoTitulo,
  titulo,
  tag,
  descripcion,
  created_at,
  removedImageUrls,
  bucket_folder_url,
}: UpdateNewsInput): Promise<Result> {
  const supabaseServer = await getSupabaseServer();

  try {
    // Obtener la novedad actual
    const { data: currentNew, error: fetchError } = await supabaseServer
      .from('Novedad')
      .select('*')
      .eq('titulo', antiguoTitulo)
      .eq('created_at', created_at.toISOString())
      .single();

    if (fetchError) throw fetchError;
    if (!currentNew) throw new Error('Novedad no encontrada');

    // Eliminar imágenes que ya no se usan
    if (removedImageUrls.length > 0) {
      const folder = currentNew.bucket_folder_url;
      if (!folder) throw new Error('No se encontró la carpeta en el registro');

      await deleteUnusedImage(folder, removedImageUrls);
    }

    // Actualizar registro en Supabase
    const { error: updateError } = await supabaseServer
      .from('Novedad')
      .update({
        titulo: titulo,
        descripcion: descripcion,
        tag: tag || null,
        bucket_folder_url: bucket_folder_url,
      })
      .eq('titulo', antiguoTitulo)
      .eq('created_at', created_at.toISOString());

    if (updateError) throw updateError;

    return {
      status: 200,
      message: 'New updated',
      data: {
        ...currentNew,
        titulo: titulo,
        descripcion: descripcion,
        tag: tag,
      },
    };
  } catch (err: any) {
    console.error('Error en updateNewsAction', err);
    return {
      status: 500,
      message: err.message || 'Unexpected error in updateNewsAction',
      data: null,
    };
  }
}

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
  bucket_folder_url,
}: New): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    if (!titulo || !descripcion) {
      return {
        status: 400,
        message: 'title and description required',
        data: null,
      };
    }

    const { data: newData, error: newError } = await supabaseServer
      .from('Novedad')
      .insert([
        {
          created_at: created_at.toISOString(),
          titulo: titulo,
          descripcion: descripcion, // JSON
          tag: tag ?? null,
          bucket_folder_url,
        },
      ])
      .select()
      .single();

    if (newError) {
      console.log(newError);
      return { status: 500, message: newError.message, data: null };
    }

    return { status: 200, message: 'New created', data: newData };
  } catch (err: any) {
    console.error('Error en uploadNew:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}

export async function retrieveNews(params?: {
  query?: string;
  tagName?: string | null;
  limit?: number;
  sort?: 'recent' | 'oldest';
}): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const limit = params?.limit ?? 10;
    const sortAsc = params?.sort === 'oldest' ? true : false;
    let qb = supabaseServer.from('Novedad').select('*');

    if (params?.tagName) {
      qb = qb.eq('tag', params.tagName);
    }
    if (params?.query) {
      // Filter only by title server-side to avoid JSON issues in descripcion
      qb = qb.ilike('titulo', `%${params.query}%`);
    }

    const { data: newData, error: newError } = await qb
      .order('created_at', { ascending: sortAsc })
      .limit(limit);

    if (newError) {
      return { status: 500, message: newError.message, data: null };
    }
    return {
      status: 200,
      message: 'News retrieved succesfully',
      data: newData,
    };
  } catch (err: any) {
    console.error('Error en retrieveNews:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}

export async function retrieveNew(id: number): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const { data: newData, error: newError } = await supabaseServer
      .from('Novedad')
      .select('*')
      .eq('id', id)
      .single();

    if (newError) {
      return { status: 500, message: newError.message, data: null };
    }
    return {
      status: 200,
      message: 'Single new retrieved succesfully',
      data: newData,
    };
  } catch (err: any) {
    console.error('Error en retrieveNews:', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}
