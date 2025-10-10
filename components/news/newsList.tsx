'use client';

import { deleteNewsAction } from '@/features/news/actions/deleteNews';
import { New } from '@/interfaces/news-interfaces';
import { renderTiptapJSON } from '@/lib/tiptap/renderTipTap';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import { Button } from '../ui/button';

export default function NewsList({ news }: { news: New[] }) {
  if (news.length === 0)
    return <p className="text-gray-500">No hay novedades aún.</p>;

  async function handleDelete(title: string, uploadDate: Date) {
    try {
      await deleteNewsAction({ title, uploadDate });
      toast.success(`Novedad ${title} eliminada con éxito`);
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar la novedad');
    }
  }

  return (
    <ul className="space-y-4">
      {news.map((n, index) => (
        <li key={index} className="space-y-2 rounded-lg border p-4 shadow-sm">
          <AlertDialog>
            <Dialog
              title={`Eliminar novedad "${n.titulo}"`}
              description="No se podrá revertir la acción."
              actionVerb="Borrar"
              onConfirm={() => handleDelete(n.titulo, n.created_at)}
            />

            <article>
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold">{n.titulo}</h3>
                <AlertDialogTrigger asChild>
                  <Button
                    className="hover:cursor-pointer"
                    variant="outline"
                    type="button"
                  >
                    <Trash2Icon />
                  </Button>
                </AlertDialogTrigger>
              </div>
              <section
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderTiptapJSON(n.descripcion),
                }}
              />
              {n.tag && (
                <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                  {n.tag}
                </span>
              )}
              <p className="text-xs text-gray-500">
                Publicado el {n.created_at}
              </p>
            </article>
          </AlertDialog>
        </li>
      ))}
    </ul>
  );
}
