import DeleteEmployeesForm from '@/components/employees/DeleteEmployeesForm';
import { getAllWorkers } from '@/features/workers/listWorkers';

export default async function Page() {
  const res = await getAllWorkers();
  const workers = res.data ?? [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-indigo-700">
          Baja de empleados
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Seleccioná uno o más empleados y confirmá la baja.
        </p>

        <DeleteEmployeesForm workers={workers} />
      </div>
    </div>
  );
}
