'use client';

import { deleteManualAction } from '@/features/manuals/actions/deleteManual';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteKeys, setToDeleteKeys] = useState<string[]>([]);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const router = useRouter();

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const allSelected = manuals.length > 0 && selected.size === manuals.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(manuals.map((m) => m.key)));
  };

  const openConfirmFor = (keys: string[]) => {
    setToDeleteKeys(keys);
    setConfirmOpen(true);
  };

  const handleSingleDelete = (key: string) => openConfirmFor([key]);

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un manual');
      return;
    }
    openConfirmFor(Array.from(selected));
  };

  const performDelete = async () => {
    if (toDeleteKeys.length === 0) return;
    const isSingle = toDeleteKeys.length === 1;
    if (isSingle) setLoadingKey(toDeleteKeys[0]);
    else setLoadingBulk(true);

    try {
      const formData = new FormData();
      toDeleteKeys.forEach((k) => formData.append('selected', k));

      const res = await deleteManualAction(formData);
      if (res?.status === 200) {
        toast.success(res.message || 'Manuales eliminados');
        setSelected((prev) => {
          const next = new Set(prev);
          toDeleteKeys.forEach((k) => next.delete(k));
          return next;
        });
        setConfirmOpen(false);
        setToDeleteKeys([]);
        if (onRefresh) onRefresh();
        else router.refresh();
      } else {
        toast.error(res?.message || 'Error eliminando manuales');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al eliminar');
    } finally {
      if (isSingle) setLoadingKey(null);
      else setLoadingBulk(false);
    }
  };

  const handleView = (m: Manual) => {
    if (onDownload) {
      onDownload(m);
      return;
    }
    if (m.url) {
      window.open(m.url, '_blank');
    } else {
      toast.error('No hay URL disponible para este archivo');
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Manuales Subidos ({manuals.length})
      </h2>

      {manuals.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2">No hay manuales subidos</p>
          <p className="text-sm">Sube tu primer manual usando el formulario</p>
        </div>
      ) : (
        <div className="space-y-3">
          {manuals.map((m) => (
            <div
              key={m.key}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {m.file_name ?? m.key}
                </p>
                <p className="text-xs text-gray-500">
                  {m.size ? `${(m.size / 1024).toFixed(1)} KB` : '—'} •{' '}
                  {m.lastModified
                    ? new Date(m.lastModified).toLocaleDateString()
                    : '—'}
                </p>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() =>
                    onDownload
                      ? onDownload(m)
                      : window.open(m.url ?? '#', '_blank')
                  }
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  title="Descargar"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleSingleDelete(m.key)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRefresh}
        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        ↻ Actualizar lista
      </button>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setConfirmOpen(false);
              setToDeleteKeys([]);
            }}
          />
          <div className="relative z-10 w-full max-w-lg rounded bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">
              Confirmar eliminación
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Vas a eliminar {toDeleteKeys.length} manual
              {toDeleteKeys.length > 1 ? 'es' : ''}. Esta acción no se puede
              deshacer.
            </p>

            <div className="mb-4 max-h-40 overflow-auto rounded border bg-gray-50 p-3">
              <ul className="text-sm text-gray-800">
                {toDeleteKeys.map((k) => {
                  const item = manuals.find((x) => x.key === k);
                  return (
                    <li key={k} className="py-1">
                      <strong>{item?.file_name || '—'}</strong>
                      <span className="ml-2 text-gray-500">({k})</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="rounded border px-4 py-2 text-sm"
                onClick={() => {
                  setConfirmOpen(false);
                  setToDeleteKeys([]);
                }}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={performDelete}
                type="button"
              >
                Eliminar {toDeleteKeys.length > 1 ? 'seleccionados' : 'manual'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
