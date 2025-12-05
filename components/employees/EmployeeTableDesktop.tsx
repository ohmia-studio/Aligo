import { TableProps } from '@/interfaces/Employee-interfaces';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeTableDesktop({
  employees,
  selected,
  toggle,
  allSelected,
  toggleSelectAll,
}: TableProps) {
  const router = useRouter();
  return (
    <div className="border-container-foreground bg-container max-w-fit overflow-x-auto rounded-lg shadow-md">
      <table className="text-base-color max-w-full text-sm">
        <thead className="from-primary/80 to-primary/60 bg-gradient-to-r">
          <tr>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4"
                aria-label="Seleccionar todo"
              />
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Nombre
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              DNI
            </th>
            <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">
              Editar
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-base">
                No hay empleados registrados.
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr
                key={String(emp.id)}
                className="hover:bg-accent/15 border-t transition-colors last:border-b"
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
                <td className="px-4 py-3 whitespace-nowrap">
                  {emp.nombre + ' ' + emp.apellido}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{emp.dni}</td>

                <td className="px-4 py-3 text-center">
                  <button
                    className="hover:bg-primary text-base-color-foreground bg-primary/90 hover:border-accent-foreground border-primary/90 rounded-full border-2 p-2 shadow-md transition duration-150 hover:border-2"
                    onClick={() => console.log('Editar', emp.id)}
                    aria-label={`Editar empleado ${emp.nombre || ''}`}
                  >
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal
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
      )} */}
    </div>
  );
}
