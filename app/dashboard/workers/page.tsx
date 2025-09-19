import { getAllWorkers } from '@/features/workers/listWorkers';
import { EmployeesTableSkeleton } from '@/ui/employees/EmployeesTableSkeleton';
import { Suspense } from 'react';

async function EmployeesTableContent() {
  const { data: empleados, status, message } = await getAllWorkers();

  if (status !== 200) {
    return (
      <div className="p-8 text-center text-red-600">
        {message || 'Error al cargar empleados'}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Listado de empleados</h1>
      {empleados.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay empleados registrados.
        </div>
      ) : (
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
          <thead className="bg-green-400">
            <tr>
              <th className="px-4 py-2 text-left text-black">ID</th>
              <th className="px-4 py-2 text-left text-black">Nombre</th>
              <th className="px-4 py-2 text-left text-black">Rol</th>
            </tr>
          </thead>
          <tbody className="bg-black">
            {empleados.map((emp: any) => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-2">{emp.id}</td>
                <td className="px-4 py-2">{emp.nombre}</td>
                <td className="px-4 py-2">{emp.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<EmployeesTableSkeleton />}>
      <EmployeesTableContent />
    </Suspense>
  );
}
