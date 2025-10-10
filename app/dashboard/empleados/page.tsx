import { EmployeesTableClient } from '@/components/employees/EmployeesTableClient';
import { EmployeesTableSkeleton } from '@/components/employees/EmployeesTableSkeleton';
import { getAllWorkers } from '@/features/workers/listWorkers';
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
        <EmployeesTableClient empleados={empleados} />
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
