'use client';

import { Resource } from '@/interfaces/resource-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { DownloadIcon, FileTextIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { usePermissions } from '../auth/PermissionGuard';
import { Dialog } from '../common/alertDialog';
import { useLoader } from '../providers/loaderProvider';
import { Button } from '../ui/button';

export interface DataProps {
  type: 'Manual' | 'Catalogo';
  fetchedData: Resource[];
  onDeleteAction: (objectKey: string) => Promise<Result>;
  onDownload?: (dataObject: Resource) => void;
  onRefresh: () => void;
}

// 1. A diferencia de los manuales, los catalogos no tienen el timestamp en el nombre, por lo que tengo que tener cuidado
// a la hora del recorte de string que hacia para no mostrar el timestamp de los manuales.
// 2. El onDelete y el onView dejan de estar por parametro y están dentro
// 3. Crear un tipo para unificar las diferencias entre Manual y catalog
// 5. Agregar los textos que deben incluirse por parametro.
// 6. Revisar el tipo que devuelve el action. En uno devuelve status y en otro un boolean success

export default function ResourcesList({
  type,
  fetchedData,
  onDeleteAction,
  onDownload,
  onRefresh,
}: DataProps) {
  const { showLoader, hideLoader } = useLoader();
  //const router = useRouter();
  const { isAdmin } = usePermissions();
  const sliceTimeStamp = (str: string | undefined, key: string) => {
    if (!str) return key;

    return str.slice(str.indexOf('_') + 1);
  };

  const performDelete = async (deletingKey: string) => {
    try {
      showLoader();
      const res = await onDeleteAction(deletingKey);
      if (!res || res.status !== 200)
        throw new Error(res?.message || 'Error eliminando' + type);

      toast.success(type + ' eliminado');
      onRefresh();
      //router.refresh();
    } catch (err) {
      console.error('delete error', err);
      toast.error((err as any)?.message ?? 'Error eliminando' + type);
    } finally {
      hideLoader();
    }
  };

  const handleView = (dataObject: Resource) => {
    if (onDownload) {
      onDownload(dataObject);
      return;
    }
    if (dataObject.url) window.open(dataObject.url, '_blank');
    else toast.error('No hay URL disponible para este archivo');
  };

  return (
    <div className="bg-container-foreground shadow-shadow-color rounded-lg p-6 shadow-md">
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        {type === 'Manual' ? 'Manuales' : 'Catalogos'} subidos (
        {fetchedData.length})
      </h2>

      {fetchedData.length === 0 ? (
        <div className="text-foreground/80 items-center justify-items-center py-8 text-center">
          <FileTextIcon size={32} className="opacity-60" />
          <p className="mt-2">
            No hay {type === 'Manual' ? 'manuales' : 'catalogos'} subidos
          </p>
          <p className="text-sm">Sube tu primer {type} usando el formulario</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {fetchedData.map((fd) => (
            <div
              key={fd.fullKey}
              className="border-container shadow-shadow-color flex items-center justify-between rounded-lg border p-3 shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl/20"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <section>
                  <p className="text-foreground truncate text-sm font-medium">
                    {sliceTimeStamp(fd.name, fd.fullKey)}
                  </p>
                  <p className="text-foreground/60 text-xs">
                    {fd.size ? fd.size : '—'} •{' '}
                    {fd.lastModified
                      ? new Date(fd.lastModified).toLocaleDateString()
                      : '—'}
                  </p>
                </section>
                <section className="flex justify-between">
                  <div className="flex w-4/5 items-center gap-4">
                    <a
                      href={`/dashboard/${type === 'Manual' ? 'manuales' : 'catalogos'}/ver?key=${encodeURIComponent(fd.fullKey)}&name=${encodeURIComponent(fd.name || fd.fullKey)}`}
                      className="bg-primary text-base-color-foreground inline-block w-[60%] cursor-pointer rounded px-4 py-2 text-center text-sm font-semibold shadow-md transition hover:shadow-md/20 hover:brightness-120"
                    >
                      Ver {type}
                    </a>
                    <button
                      onClick={() => handleView(fd)}
                      className="text-accent cursor-pointer text-sm font-medium hover:brightness-120"
                      title="Descargar"
                    >
                      <DownloadIcon />
                    </button>
                  </div>

                  {isAdmin && (
                    <AlertDialog>
                      <Dialog
                        title={`Eliminar "${sliceTimeStamp(fd.name, fd.fullKey)}"`}
                        description="No se podrá revertir la acción."
                        actionVerb="Borrar"
                        onConfirm={() => performDelete(fd.fullKey)}
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
