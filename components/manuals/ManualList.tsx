'use client';

import { deleteManualAction } from '@/features/manuals/actions/deleteManual';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Manual = {
  id: string | number;
  title?: string;
  file_name?: string;
  url?: string;
  created_at?: string;
};

export default function ManualList({ manuals }: { manuals: Manual[] }) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState<Array<string | number>>([]);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const router = useRouter();

  const toggle = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const allSelected = manuals.length > 0 && selected.size === manuals.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(manuals.map((m) => m.id)));
  };

  const openConfirmFor = (ids: Array<string | number>) => {
    setToDeleteIds(ids);
    setConfirmOpen(true);
  };

  const handleSingleDelete = (id: string | number) => openConfirmFor([id]);

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un manual');
      return;
    }
    openConfirmFor(Array.from(selected));
  };

  const performDelete = async () => {
    if (toDeleteIds.length === 0) return;
    const isSingle = toDeleteIds.length === 1;
    if (isSingle) setLoadingId(toDeleteIds[0]);
    else setLoadingBulk(true);

    try {
      const formData = new FormData();
      toDeleteIds.forEach((id) => formData.append('selected', String(id)));

      const res = await deleteManualAction(formData);
      if (res?.status === 200) {
        toast.success(res.message || 'Manuales eliminados');
        // limpiar selección
        setSelected((prev) => {
          const next = new Set(prev);
          toDeleteIds.forEach((id) => next.delete(id));
          return next;
        });
        router.refresh();
        setConfirmOpen(false);
        setToDeleteIds([]);
      } else {
        toast.error(res?.message || 'Error eliminando manuales');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al eliminar');
    } finally {
      if (isSingle) setLoadingId(null);
      else setLoadingBulk(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded bg-gray-100 px-3 py-1 text-sm"
            onClick={toggleSelectAll}
          >
            {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={loadingBulk || selected.size === 0}
            className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loadingBulk
              ? 'Eliminando...'
              : `Eliminar seleccionados (${selected.size})`}
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded border bg-white">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr>
              <th className="w-12 p-2"></th>
              <th className="p-2 text-left">Título</th>
              <th className="p-2 text-left">Archivo</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {manuals.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No hay manuales.
                </td>
              </tr>
            ) : (
              manuals.map((m) => (
                <tr key={String(m.id)} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => toggle(m.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-2">{m.title}</td>
                  <td className="p-2">
                    {m.file_name ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600"
                      >
                        {m.file_name}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2">
                    {m.created_at
                      ? new Date(m.created_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="rounded bg-red-500 px-3 py-1 text-white"
                        onClick={() => handleSingleDelete(m.id)}
                        disabled={loadingId === m.id}
                      >
                        {loadingId === m.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">
              Confirmar eliminación
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Vas a eliminar {toDeleteIds.length} manual
              {toDeleteIds.length > 1 ? 'es' : ''}. Esta acción no se puede
              deshacer.
            </p>

            <div className="mb-4 max-h-40 overflow-auto rounded border bg-gray-50 p-3">
              <ul className="text-sm text-gray-800">
                {toDeleteIds.map((id) => {
                  const item = manuals.find((x) => x.id === id);
                  return (
                    <li key={String(id)} className="py-1">
                      <strong>{item?.title || '—'}</strong>
                      <span className="ml-2 text-gray-500">
                        ({item?.file_name || '—'})
                      </span>
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
                  setToDeleteIds([]);
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
                Eliminar {toDeleteIds.length > 1 ? 'seleccionados' : 'manual'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
