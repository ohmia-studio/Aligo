'use client';
import { Pencil, Trash } from 'lucide-react';

interface Employee {
  id: string | number;
  dni?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

export function EmployeesTableClient({ empleados }: { empleados: Employee[] }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-2 py-4 sm:px-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="rounded-xl bg-gradient-to-r from-green-500 to-green-400 px-5 py-2 font-semibold text-white shadow-md transition hover:from-green-600 hover:to-green-500"
          onClick={() => console.log('Agregar empleado')}
        >
          + Agregar empleado
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-sm text-black">
          <thead className="bg-gradient-to-r from-green-400 to-green-300">
            <tr>
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
                  colSpan={6}
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
                      className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none"
                      onClick={() => console.log('Eliminar', emp.id)}
                      aria-label={`Eliminar empleado ${emp.nombre || ''}`}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
