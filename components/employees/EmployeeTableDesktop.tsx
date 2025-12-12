import { Employee } from '@/interfaces/Employee-interfaces';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeTableDesktop({
  employees,
  selected,
  toggle,
  allSelected,
  toggleSelectAll,
  onEdit,
}: {
  employees: Employee[];
  selected: Set<number | string>;
  toggle: (id: number | string) => void;
  allSelected: boolean;
  toggleSelectAll: () => void;
  onEdit?: (emp: Employee) => void;
}) {
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
                    onClick={() => onEdit?.(emp)}
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
    </div>
  );
}
