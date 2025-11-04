'use client';

import { TextEditor } from '@/components/tiptap/tiptap-templates/tiptap-editor';
import { createNewsAction } from '@/features/news/actions/createNews';
import { updateNewsAction } from '@/features/news/actions/updateNews';
import { moveExistingImage, uploadNewImage } from '@/features/news/news';
import { createTagAction } from '@/features/news/tags';
import { EditorImage } from '@/interfaces/editor-interfaces';
import { New, NewEdit, TagItem } from '@/interfaces/news-interfaces';
import {
  newsStorageFileSnakeCase,
  newsStorageFolderSnakeCase,
  sanitizeForStorage,
} from '@/lib/storageStringCase';
import { normalizeTipTapDocument } from '@/lib/tiptap/normalizeTiptap';
import {
  extractImageSrcsFromJSON,
  replaceImageSrcsInJSON,
} from '@/lib/tiptap/tiptap-images-src';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { TagDropdown } from '../common/tagDropdown';

export default function NewsForm({
  tags: initialTags,
  new: loadedNew,
  onSubmit,
}: {
  tags: TagItem[];
  new?: NewEdit;
  onSubmit?: () => void;
}) {
  const [newsForm, setNewsForm] = useState<New>({
    titulo: loadedNew?.titulo || '',
    tag: loadedNew?.tag || '',
    descripcion: loadedNew?.descripcion || null,
    bucket_folder_url: loadedNew?.bucket_folder_url || '',
    created_at: loadedNew?.created_at || new Date(),
  });

  // TODO: esto tiene que ser un estado o simplemente puede ser una constante/variable?
  const [oldTitle, setOldTitle] = useState(loadedNew?.titulo || '');
  const [removedImages, setRemoveImages] = useState<string[]>([]);

  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [images, setImages] = useState<EditorImage[]>([]);
  const [loading, setLoading] = useState(false);

  // Si el id no es -1, es una novedad existente === edición
  const NUEVA_NOVEDAD: number = -1;

  const router = useRouter();

  async function handleCreateTag(tag: TagItem) {
    try {
      const newTag = await createTagAction(tag);
      setTags((prev) => [...prev, newTag]);
      toast.success(`Tag "${tag.nombre}" creado`);
    } catch (err: any) {
      toast.error(err.message || 'Error al crear el tag');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones cliente (UX)
    if (!newsForm.titulo?.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!newsForm.descripcion) {
      toast.error('El contenido es obligatorio');
      return;
    }

    setLoading(true);

    try {
      // 1) sincronizar stagedImages con description
      const currentSrcs = extractImageSrcsFromJSON(newsForm.descripcion);
      // En currentSrcs se obtienen tambien las imagenes precargadas (al editar x ej)
      const newImages = images.filter((s) => currentSrcs.includes(s.src));

      const folderName = sanitizeForStorage(
        newsStorageFolderSnakeCase(newsForm.titulo, newsForm.created_at)
      );

      let mapping: Record<string, string> = {};

      let bucketFolderUrl = '';

      // En el caso de que sea una edicion x ej y que ya se encuentre guardada correctamente la url del bucket, ya se mantiene
      if (newsForm.bucket_folder_url.includes(folderName))
        bucketFolderUrl = newsForm.bucket_folder_url;

      // En el caso de ser la edición de una noticia, aca separamos las imagenes que ya estaban de antemano
      // Ademas solamente actualizamos las url de las imagenes si se cambio el titulo, sino no hace falta.
      if (loadedNew?.id !== NUEVA_NOVEDAD && oldTitle !== newsForm.titulo) {
        const oldImages = currentSrcs.filter(
          (src) => !newImages.map((image) => image.src).includes(src)
        );

        const oldUrl = sanitizeForStorage(
          newsStorageFolderSnakeCase(oldTitle, newsForm.created_at)
        );

        // Añado al mapping la nueva dirección para la imagen vieja
        // Es mejor usar un 'for of' que un 'foreach' ya que soporta async await (asincronía)
        for (const img of oldImages) {
          const fileName = img.split('/').pop();

          if (!fileName)
            throw new Error(
              'Error al obtener la dirección del fichero a mover en el storage'
            );

          const responseStorage = await moveExistingImage(
            oldUrl,
            folderName,
            fileName
          );

          if (responseStorage.status !== 200)
            throw Error(responseStorage.message);

          if (bucketFolderUrl === '' || !bucketFolderUrl?.includes(folderName))
            bucketFolderUrl = responseStorage.data;

          mapping[img] = img.replace(oldUrl, folderName);
        }
      }

      // 2) Se suben las imagenes al bucket storage una a una (no es optimo, supabase batch para subir de a varias)
      let fileIndex = 0;
      for (const item of newImages) {
        const imageName = sanitizeForStorage(
          `${fileIndex}-${encodeURIComponent(newsStorageFileSnakeCase(item.image.name))}`
        );
        const responseStorage = await uploadNewImage(
          folderName,
          imageName,
          item.image
        );

        if (responseStorage.status !== 200)
          throw Error(responseStorage.message);

        // Aqui guardo la url en una variable y no directamente en el estado porque los setState son asincronos y encolados por React
        // por lo que la mayoria de las veces el bucle termina y no se ha llegado a guardar correctamente la dirección.
        if (bucketFolderUrl === '' || !bucketFolderUrl?.includes(folderName))
          bucketFolderUrl = responseStorage.data;

        const path = `${responseStorage.data}/${imageName}`;
        mapping[item.src] = path || '';
        fileIndex++;
      }

      // luego de subir todas
      setNewsForm((prev) => ({
        ...prev,
        bucket_folder_url: bucketFolderUrl,
      }));

      // 3) reemplazar src en JSON
      const updatedDescription = replaceImageSrcsInJSON(
        newsForm.descripcion,
        mapping
      );

      /*-- Pasos necesarios para no perder los atributos level del heading --*/
      const normalized = normalizeTipTapDocument(updatedDescription);
      // conversión a string explícitamente
      const payloadDescripcionStr = JSON.stringify(normalized);
      /*-- Para más detalle leer "Problemática de los atributos del nodo Heading" en features/news/NEWS_README.MD --*/

      // 4) Action a ejecutar dependiendo de si es una edición o creación
      if (loadedNew?.id !== NUEVA_NOVEDAD) {
        await updateNewsAction({
          created_at: newsForm.created_at,
          titulo: newsForm.titulo,
          tag: newsForm.tag,
          descripcion: payloadDescripcionStr,
          bucket_folder_url: bucketFolderUrl,
          antiguoTitulo: oldTitle,
          removedImageUrls: removedImages,
        });
        toast.success('Novedad editada con éxito');
      } else {
        await createNewsAction({
          created_at: newsForm.created_at,
          titulo: newsForm.titulo.trim(),
          descripcion: payloadDescripcionStr,
          tag: newsForm.tag || null,
          bucket_folder_url: bucketFolderUrl,
        });
        toast.success('Novedad creada con éxito');
      }

      if (onSubmit) onSubmit();
      setNewsForm({
        titulo: '',
        descripcion: null,
        tag: '',
        bucket_folder_url: '',
        created_at: new Date(),
      });

      // Refresca los datos cliente para reflejar cambios sin reload completo
      router.refresh();

      // cleanup: revocar object URLs
      images.forEach((s) => {
        try {
          URL.revokeObjectURL(s.src);
        } catch {}
      });

      // Limpia formulario

      setImages([]);
    } catch (err: any) {
      toast.error(err?.message ?? 'Error al crear la novedad');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[90svh] flex-col rounded-lg border p-4 shadow"
    >
      <section className="h-[82svh]">
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="w-full">
            <label className="text-sm font-medium">Título</label>
            <input
              name="titulo"
              type="text"
              value={newsForm.titulo}
              onChange={(e) =>
                setNewsForm((prev) => ({
                  ...prev,
                  titulo: e.target.value,
                }))
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label className="text-sm font-medium">
              Tag <span className="opacity-40">(opcional)</span>
            </label>
            <TagDropdown
              tags={tags}
              value={newsForm.tag == null ? '' : newsForm.tag}
              onChange={(value) =>
                setNewsForm((prev) => ({
                  ...prev,
                  tag: value,
                }))
              }
              onCreateTag={handleCreateTag}
            />
          </div>
        </div>
        {/* Incluye onChange para devolver JSON */}

        <TextEditor
          content={newsForm.descripcion}
          onChange={(content) => {
            setNewsForm((prev) => ({
              ...prev,
              descripcion: content,
            }));
          }}
          onAddImage={(img) => setImages((prev) => [...prev, img])}
          onRemoveImage={(src) => {
            if (loadedNew?.id !== NUEVA_NOVEDAD)
              setRemoveImages((prev) => [
                ...prev,
                src.slice(src.indexOf('Novedades') + 10),
              ]); // Corta las 9 letras de novedades y luego el '/'
          }}
        />
      </section>

      <button
        type="submit"
        disabled={loading}
        className="h-[5svh] w-40 rounded bg-orange-800 px-4 py-2 text-white hover:cursor-pointer hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading
          ? 'Enviando...'
          : loadedNew?.id !== NUEVA_NOVEDAD
            ? 'Editar novedad'
            : 'Crear novedad'}
      </button>
    </form>
  );
}
