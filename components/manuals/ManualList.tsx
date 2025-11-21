'use client';

import { deleteManualAction } from '@/features/manuals/actions/deleteManual';
import { RootState } from '@/store/store';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { DownloadIcon, FileTextIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Dialog } from '../common/alertDialog';
import { useLoader } from '../providers/loaderProvider';
import { Button } from '../ui/button';

type Manual = {
  key: string;
  file_name?: string;
  url?: string;
  size?: number;
  lastModified?: string | null;
};

type ManualListProps = {
  manuals: Manual[];
  onDelete?: (key: string) => void;
  onDownload?: (m: Manual) => void;
  onRefresh?: () => void;
};

export default function ManualList({
  manuals,
  onDelete,
  onDownload,
  onRefresh,
}: ManualListProps) {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const rol = user?.rol || 'usuario';

  const sliceTimeStamp = (str: string | undefined, key: string) => {
    if (!str) return key;

    return str.slice(str.indexOf('_') + 1);
  };

  const performDelete = async (deletingKey: string) => {
    try {
      showLoader();
      // permitir override por props (page puede manejar delete)
      if (onDelete) {
        await onDelete(deletingKey);
      } else {
        const formData = new FormData();
        formData.append('selected', deletingKey);
        const res = await deleteManualAction(formData);
        if (!res || res.status !== 200)
          throw new Error(res?.message || 'Error eliminando manual');
      }

      toast.success('Manual eliminado');
      if (onRefresh) onRefresh();
      else router.refresh();
    } catch (err) {
      console.error('delete error', err);
      toast.error((err as any)?.message ?? 'Error eliminando manual');
    } finally {
      hideLoader();
    }
  };

  const handleView = (m: Manual) => {
    if (onDownload) {
      onDownload(m);
      return;
    }
    if (m.url) window.open(m.url, '_blank');
    else toast.error('No hay URL disponible para este archivo');
  };

  return (
    <div className="bg-container-foreground shadow-shadow-color rounded-lg p-6 shadow-md">
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        Manuales Subidos ({manuals.length})
      </h2>

      {manuals.length === 0 ? (
        <div className="text-foreground/80 items-center justify-items-center py-8 text-center">
          <FileTextIcon size={32} className="opacity-60" />
          <p className="mt-2">No hay manuales subidos</p>
          <p className="text-sm">Sube tu primer manual usando el formulario</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {manuals.map((m) => (
            <div
              key={m.key}
              className="border-container shadow-shadow-color flex items-center justify-between rounded-lg border p-3 shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl/20"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <section>
                  <p className="text-foreground truncate text-sm font-medium">
                    {sliceTimeStamp(m.file_name, m.key)}
                  </p>
                  <p className="text-foreground/60 text-xs">
                    {m.size ? `${(m.size / 1024).toFixed(1)} KB` : '—'} •{' '}
                    {m.lastModified
                      ? new Date(m.lastModified).toLocaleDateString()
                      : '—'}
                  </p>
                </section>
                <section className="flex justify-between">
                  <div className="flex w-4/5 items-center gap-4">
                    <button
                      type="button"
                      className="bg-primary text-base-color-foreground w-[60%] cursor-pointer rounded px-4 py-2 text-center text-sm font-semibold shadow-md transition hover:bg-blue-700 hover:shadow-md/20"
                    >
                      <a
                        href={`/dashboard/manuales/ver?key=${encodeURIComponent(m.key)}&name=${encodeURIComponent(m.file_name || m.key)}`}
                      >
                        Ver manual
                      </a>
                    </button>
                    <button
                      onClick={() => handleView(m)}
                      className="text-accent cursor-pointer text-sm font-medium hover:text-blue-800"
                      title="Descargar"
                    >
                      <DownloadIcon />
                    </button>
                  </div>

                  {rol === 'admin' && (
                    <AlertDialog>
                      <Dialog
                        title={`Eliminar "${m.file_name}"`}
                        description="No se podrá revertir la acción."
                        actionVerb="Borrar"
                        onConfirm={() => performDelete(m.key)}
                      />
                      <AlertDialogTrigger asChild>
                        <Button
                          className="hover:shadow-destructive hover:cursor-pointer"
                          variant="outline"
                          type="button"
                        >
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                    </AlertDialog>
                  )}
                </section>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRefresh}
        className="text-primary/90 hover:text-primary mt-4 text-sm font-medium hover:cursor-pointer"
      >
        ↻ Actualizar lista
      </button>
    </div>
  );
}
