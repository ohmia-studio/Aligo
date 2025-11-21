'use client';

import { deleteNewsAction } from '@/features/news/actions/deleteNews';
import { New, NewEdit } from '@/interfaces/news-interfaces';
import { renderTiptapJSON } from '@/lib/tiptap/renderTipTap';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { EditIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import { Button } from '../ui/button';

const NewsItem = React.memo(function NewsItem({
  n,
  index,
  onEdit,
  onDelete,
  hasPermision,
}: {
  n: New;
  index: number;
  onEdit: (newToEdit: NewEdit) => void;
  onDelete: (title: string, uploadDate: Date) => Promise<void>;
  hasPermision: boolean;
}) {
  return (
    <li className="flex h-auto flex-wrap space-y-2 rounded-lg border p-4 shadow-sm">
      <article className="text-base-color flex w-full flex-col gap-2">
        <div className="flex flex-wrap-reverse items-center gap-4 md:flex-wrap">
          <h2>{n.titulo}</h2>
          <div className="flex w-full flex-row items-center gap-8 md:w-fit">
            {n.tag && (
              <span className="bg-accent text-accent-foreground max-h-fit min-w-fit rounded px-2 py-1 text-sm">
                {n.tag}
              </span>
            )}
            {hasPermision && (
              <div className="flex flex-auto justify-end gap-2 md:justify-start">
                <Button
                  className="border-accent hover:cursor-pointer"
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    onEdit({
                      id: index,
                      titulo: n.titulo,
                      tag: n.tag,
                      descripcion: n.descripcion,
                      bucket_folder_url: n.bucket_folder_url,
                      created_at: new Date(n.created_at),
                    })
                  }
                >
                  <EditIcon />
                </Button>
                <AlertDialog>
                  <Dialog
                    title={`Eliminar "${n.titulo}"`}
                    description="No se podrá revertir la acción."
                    actionVerb="Borrar"
                    onConfirm={() => onDelete(n.titulo, n.created_at)}
                  />
                  <AlertDialogTrigger asChild>
                    <Button
                      className="hover:cursor-pointer"
                      variant="destructive"
                      type="button"
                    >
                      <Trash2Icon />
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
        <section
          className="prose text-base-color mb-8"
          dangerouslySetInnerHTML={{ __html: renderTiptapJSON(n.descripcion) }}
        />
        <p className="text-base-color/60 text-xs">
          Fecha publicación: {new Date(n.created_at).toLocaleString()}
        </p>
      </article>
    </li>
  );
});

export default function NewsList({
  news,
  onEdit,
  hasPermission,
}: {
  news: New[];
  onEdit: (newToEdit: NewEdit) => void;
  hasPermission: boolean;
}) {
  if (!news.length)
    return <p className="text-base-color/80">🤔 No hay novedades aún...</p>;

  async function handleDelete(title: string, uploadDate: Date) {
    try {
      await deleteNewsAction({ title, uploadDate });
      toast.success(`Novedad "${title}" eliminada con éxito`);
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar la novedad');
    }
  }

  return (
    <ul className="space-y-4">
      {news.map((n, i) => (
        <NewsItem
          key={n.titulo + n.created_at}
          n={n}
          index={i}
          onEdit={onEdit}
          onDelete={handleDelete}
          hasPermision={hasPermission}
        />
      ))}
    </ul>
  );
}
