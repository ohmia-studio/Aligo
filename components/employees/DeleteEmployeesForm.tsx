'use client';

import { deleteEmployeeAction } from '@/features/employees/actions/deleteEmployee';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Worker = {
  id: number | string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
};

export default function DeleteEmployeesForm({
  workers,
}: {
  workers: Worker[];
}) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleDelete = async () => {
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un empleado');
      return;
    }
    if (!confirm(`Eliminar ${selected.size} empleado(s)?`)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Array.from(selected).forEach((id) =>
        formData.append('selected', String(id))
      );

      const result = await deleteEmployeeAction(formData);
      toast[result.status === 200 ? 'success' : 'error'](
        result.message || 'Resultado desconocido'
      );

      router.refresh();
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      toast.error('Error inesperado al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSelected(new Set(workers.map((w) => w.id)));
          }}
          className="rounded bg-gray-100 px-3 py-1 text-sm"
        >
          Seleccionar todo
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Eliminando...' : 'Eliminar seleccionados'}
        </button>
      </div>

      <div className="overflow-auto rounded border bg-white">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left">
              <th className="w-12 p-2">#</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Email</th>
              <th className="p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={String(w.id)} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(w.id)}
                    onChange={() => toggle(w.id)}
                  />
                </td>
                <td className="p-2">
                  {[w.nombre, w.apellido].filter(Boolean).join(' ') || '—'}
                </td>
                <td className="p-2">{w.email || '—'}</td>
                <td className="p-2">{w.telefono || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
