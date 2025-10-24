'use client';
import { deleteEmployeeAction } from '@/features/employees/actions/deleteEmployee';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Employee {
  id: string | number;
  dni?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

export function EmployeesTableClient({ empleados }: { empleados: Employee[] }) {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState<Array<string | number>>([]);
  const router = useRouter();

  const toggle = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const allSelected =
    empleados.length > 0 && selected.size === empleados.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(empleados.map((e) => e.id)));
  };

  const openConfirmFor = (ids: Array<string | number>) => {
    setToDeleteIds(ids);
    setConfirmOpen(true);
  };

  const handleSingleDelete = (id: string | number) => openConfirmFor([id]);

  const handleBulkDelete = () => {
    if (selected.size === 0) {
      toast.error('Seleccioná al menos un empleado');
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

      const res = await deleteEmployeeAction(formData);
      toast[res.status === 200 ? 'success' : 'error'](
        res.message || 'Resultado desconocido'
      );

      setSelected((prev) => {
        const next = new Set(prev);
        toDeleteIds.forEach((id) => next.delete(id));
        return next;
      });
      router.refresh();
      setConfirmOpen(false);
      setToDeleteIds([]);
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al eliminar');
    } finally {
      if (isSingle) setLoadingId(null);
      else setLoadingBulk(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-2 py-4 sm:px-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl bg-gradient-to-r from-green-500 to-green-400 px-5 py-2 font-semibold text-white shadow-md transition hover:from-green-600 hover:to-green-500"
            onClick={() => router.push('/dashboard/empleados/alta')}
          >
            + Agregar empleado
          </button>

          <button
            className="rounded bg-gray-100 px-3 py-1 text-sm text-black"
            onClick={toggleSelectAll}
          >
            {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={loadingBulk || selected.size === 0}
            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            aria-label="Eliminar seleccionados"
          >
            {loadingBulk ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Eliminando...
              </>
            ) : (
              `Eliminar seleccionados (${selected.size})`
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-sm text-black">
          <thead className="bg-gradient-to-r from-green-400 to-green-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4"
                  aria-label="Seleccionar todo"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                DNI
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Apellido
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap text-black">
                Correo
              </th>
              <th className="px-4 py-3 text-center font-semibold whitespace-nowrap text-black">
                Editar
              </th>
              <th className="px-4 py-3 text-center font-semibold whitespace-nowrap text-black">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="text-black">
            {empleados.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-base text-gray-400"
                >
                  No hay empleados registrados.
                </td>
              </tr>
            ) : (
              empleados.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t text-black transition-colors last:border-b hover:bg-green-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    <input
                      type="checkbox"
                      checked={selected.has(emp.id)}
                      onChange={() => toggle(emp.id)}
                      className="h-4 w-4"
                      aria-label={`Seleccionar empleado ${emp.nombre || ''}`}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {emp.dni}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {emp.nombre}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {emp.apellido}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black">
                    {emp.email}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      onClick={() => console.log('Editar', emp.id)}
                      aria-label={`Editar empleado ${emp.nombre || ''}`}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="flex items-center justify-center rounded-full bg-red-500 p-2 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none"
                      onClick={() => handleSingleDelete(emp.id)}
                      aria-label={`Eliminar empleado ${emp.nombre || ''}`}
                      disabled={loadingId === emp.id}
                    >
                      {loadingId === emp.id ? (
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : (
                        <Trash size={18} />
                      )}
                    </button>
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
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Confirmar baja
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Vas a eliminar {toDeleteIds.length} empleado
              {toDeleteIds.length > 1 ? 's' : ''}. Esta acción no se puede
              deshacer.
            </p>

            <div className="mb-4 max-h-40 overflow-auto rounded border bg-gray-50 p-3">
              <ul className="text-sm text-gray-800">
                {toDeleteIds.map((id) => {
                  const e = empleados.find((x) => x.id === id);
                  return (
                    <li key={String(id)} className="py-1">
                      <strong>
                        {[e?.nombre, e?.apellido].filter(Boolean).join(' ') ||
                          '—'}
                      </strong>
                      <span className="ml-2 text-gray-500">
                        ({e?.email || 'sin email'})
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
                Eliminar {toDeleteIds.length > 1 ? 'seleccionados' : 'empleado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
