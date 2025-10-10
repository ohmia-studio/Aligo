'use server';
// features/news/news.ts
import { New } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';

// Por alguna razon el uploadDate (y siempre que recibo desde la BD la fecha, la recibo en String, por más de que esté el tipo de Date o TimeStamp)
export async function deleteNew(title: string, uploadDate: Date, folder: string) {

  const supabaseServer = await getSupabaseServer();
  try {
    const { data, error } = await supabaseServer.from('Novedad').delete().eq('titulo', title).eq('created_at', uploadDate);
    if (error) throw error;

    const { data: files, error: listError } = await supabaseServer.storage
      .from('Novedades')
      .list(folder, { limit: 1000 });

    if (listError) throw listError;

    console.log('Archivos encontrados:', files);

    if (files && files.length > 0) {
      // Obtener todos los archivos de la carpeta del bucket. No se puede eliminar llamando unicamente a la carpeta
      // ya que no existe una carpeta en si, sino que es una forma visual de mostrar rutas de archivos ordenados.
      const paths = files.map(f => `${folder}/${f.name}`);
      const { error: removeError } = await supabaseServer.storage
        .from('Novedades')
        .remove(paths);

      if (removeError) throw removeError;
    }

    return {
      status: 200,
      message: 'Novedad eliminada correctamente',
      data: null
    }
  } catch (err: any) {
    console.error('Error en delteNew', err);
    return {
      status: 500,
      message: err?.message || 'unexpected error in deleteNew',
      data: null
    }
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

export async function uploadNewImage(
  folderName: string,
  imageName: string,
  file: File
): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const { data, error } = await supabaseServer.storage
      .from('Novedades')
      .upload(`${folderName}/${imageName}`, file, { upsert: false });

    if (error) throw error;

    // Obtener URL pública
    const { data: publicUrl } = supabaseServer.storage
      .from('Novedades')
      .getPublicUrl(folderName);

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

export async function retrieveNews(): Promise<Result> {
  const supabaseServer = await getSupabaseServer();
  try {
    const { data: newData, error: newError } = await supabaseServer
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
    return {
      status: 500,
      message: err?.message || 'unexpected error',
      data: null,
    };
  }
}
