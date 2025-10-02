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
    <div>
      <div className="mb-4 flex justify-end">
        <button
          className="rounded-xl bg-green-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-600"
          onClick={() => console.log('Agregar empleado')}
        >
          + Agregar empleado
        </button>
      </div>
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
        <thead className="bg-green-400">
          <tr>
            <th className="px-4 py-2 text-left text-black">DNI</th>
            <th className="px-4 py-2 text-left text-black">Nombre</th>
            <th className="px-4 py-2 text-left text-black">Apellido</th>
            <th className="px-4 py-2 text-left text-black">Correo</th>
            <th className="px-4 py-2 text-center text-black">Editar</th>
            <th className="px-4 py-2 text-center text-black">Eliminar</th>
          </tr>
        </thead>
        <tbody className="bg-black">
          {empleados.map((emp) => (
            <tr key={emp.id} className="border-t">
              <td className="px-4 py-2">{emp.dni}</td>
              <td className="px-4 py-2">{emp.nombre}</td>
              <td className="px-4 py-2">{emp.apellido}</td>
              <td className="px-4 py-2">{emp.email}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600"
                  onClick={() => console.log('Editar', emp.id)}
                >
                  <Pencil size={16} />
                </button>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
                  onClick={() => console.log('Eliminar', emp.id)}
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
