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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();

  const openConfirm = (key: string) => {
    setDeletingKey(key);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setDeletingKey(null);
  };

  const performDelete = async () => {
    if (!deletingKey) return;
    setLoadingDelete(true);

    try {
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
      closeConfirm();
      if (onRefresh) onRefresh();
      else router.refresh();
    } catch (err) {
      console.error('delete error', err);
      toast.error((err as any)?.message ?? 'Error eliminando manual');
    } finally {
      setLoadingDelete(false);
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
                {/* Botón Ver */}
                <a
                  href={`/dashboard/manuales/ver?key=${encodeURIComponent(m.key)}&name=${encodeURIComponent(m.file_name || m.key)}`}
                  className="text-sm font-medium text-green-600 hover:text-green-800"
                  title="Ver PDF"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </a>

                {/* Botón Descargar */}
                <button
                  onClick={() => handleView(m)}
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
                  onClick={() => openConfirm(m.key)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                  title="Eliminar"
                  disabled={loadingDelete}
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

      {/* Confirm modal (solo eliminación individual) */}
      {confirmOpen && deletingKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeConfirm}
          />
          <div className="relative z-10 w-full max-w-lg rounded bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              ¿Confirmás eliminar este manual?
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              Se eliminará permanentemente el manual seleccionado. Esta acción
              no se puede deshacer.
            </p>

            <div className="mb-4 rounded border bg-gray-50 p-3">
              <p className="text-sm text-gray-800">
                <strong>
                  {manuals.find((x) => x.key === deletingKey)?.file_name ??
                    deletingKey}
                </strong>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="rounded border px-4 py-2 text-sm"
                onClick={closeConfirm}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={performDelete}
                type="button"
                disabled={loadingDelete}
              >
                {loadingDelete ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
