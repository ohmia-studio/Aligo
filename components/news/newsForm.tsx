'use client';

import { TextEditor } from '@/components/tiptap/tiptap-templates/tiptap-editor';
import { createNewsAction } from '@/features/news/actions/createNews';
import { uploadNewImage } from '@/features/news/news';
import { createTagAction } from '@/features/news/tags';
import { EditorImage } from '@/interfaces/editor-interfaces';
import { TagItem } from '@/interfaces/news-interfaces';
import {
  extractImageSrcsFromJSON,
  replaceImageSrcsInJSON,
} from '@/lib/tiptap/tiptap-images-src';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { TagDropdown } from '../common/tagDropdown';

export default function NewsForm({ tags: initialTags }: { tags: TagItem[] }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [description, setDescription] = useState<any>(null); // TipTap JSON
  const [images, setImages] = useState<EditorImage[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (!title?.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!description) {
      toast.error('El contenido es obligatorio');
      return;
    }

    setLoading(true);

    try {
      // 1) sincronizar stagedImages con description
      const currentSrcs = extractImageSrcsFromJSON(description);
      const relevantImages = images.filter((s) => currentSrcs.includes(s.src));

      const newPublishTime = new Date();
      const folderName = title
        .trim()
        .concat(newPublishTime.getTime().toString());

      let mapping: Record<string, string> = {};
      let bucket_folder_url = '';
      // 2) Se suben las imagenes al bucket storage una a una (no es optimo, creo que hay un metodo para subir varias al mismo tiempo)
      for (const item of relevantImages) {
        const imageName = `${newPublishTime.getTime().toString()}-${encodeURIComponent(item.image.name)}`;
        const responseStorage = await uploadNewImage(
          folderName,
          imageName,
          item.image
        );

        if (responseStorage.status !== 200)
          throw Error(responseStorage.message);

        if (bucket_folder_url === '') bucket_folder_url = responseStorage.data;

        const path = `${responseStorage.data}/${imageName}`;
        mapping[item.src] = path || '';
      }

      // 3) reemplazar src en JSON
      const updatedDescription = replaceImageSrcsInJSON(description, mapping);

      await createNewsAction({
        created_at: newPublishTime,
        titulo: title.trim(),
        descripcion: updatedDescription,
        tag: tag || null,
        bucket_folder_url,
      });

      toast.success('Novedad creada con éxito');

      // Refresca los datos cliente para reflejar cambios sin reload completo
      router.refresh();

      // cleanup: revocar object URLs
      images.forEach((s) => {
        try {
          URL.revokeObjectURL(s.src);
        } catch {}
      });

      // Limpia formulario
      setTitle('');
      setTag('');
      setDescription(null);
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
        <h2 className="text-lg font-semibold">Crear nueva novedad</h2>
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="w-full">
            <label className="text-sm font-medium">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={tag}
              onChange={setTag}
              onCreateTag={handleCreateTag}
            />
          </div>
        </div>
        {/* Incluye onChange para devolver JSON */}

        <TextEditor
          content={description}
          onChange={setDescription}
          onAddImage={(img) => setImages((prev) => [...prev, img])}
          onRemoveImage={(src) => {
            // aquí filtras y revocas objectURL
            setImages((prev) => {
              const removed = prev.filter((p) => p.src === src);
              const next = prev.filter((p) => p.src !== src);
              removed.forEach((r) => {
                try {
                  URL.revokeObjectURL(r.src);
                } catch {}
              });
              return next;
            });
          }}
        />
      </section>

      <button
        type="submit"
        disabled={loading}
        className="h-[5svh] w-40 rounded bg-orange-800 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading ? 'Enviando...' : 'Crear novedad'}
      </button>
    </form>
  );
}
