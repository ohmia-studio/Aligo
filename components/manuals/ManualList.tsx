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

export default function ManualList({ manuals }: { manuals: Manual[] }) {
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
        // limpiar selección
        setSelected((prev) => {
          const next = new Set(prev);
          toDeleteKeys.forEach((k) => next.delete(k));
          return next;
        });
        router.refresh();
        setConfirmOpen(false);
        setToDeleteKeys([]);
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
              <th className="p-2 text-left">Título / Archivo</th>
              <th className="p-2 text-left">Tamaño</th>
              <th className="p-2 text-left">Modificado</th>
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
                <tr key={m.key} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.has(m.key)}
                      onChange={() => toggle(m.key)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-2">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block max-w-sm truncate font-medium text-indigo-600"
                    >
                      {m.file_name}
                    </a>
                  </td>
                  <td className="p-2">
                    {m.size ? `${(m.size / 1024).toFixed(1)} KB` : '—'}
                  </td>
                  <td className="p-2">
                    {m.lastModified
                      ? new Date(m.lastModified).toLocaleString()
                      : '—'}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="rounded bg-red-500 px-3 py-1 text-white"
                        onClick={() => handleSingleDelete(m.key)}
                        disabled={loadingKey === m.key}
                      >
                        {loadingKey === m.key ? '...' : 'Eliminar'}
                      </button>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-gray-100 px-3 py-1 text-sm"
                      >
                        Ver
                      </a>
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
