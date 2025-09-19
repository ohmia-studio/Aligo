// Skeleton loader para la tabla de empleados con shimmer limpio usando Tailwind extendido
export function EmployeesTableSkeleton() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-start rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 p-8 shadow-lg">
      <div className="relative mb-8 h-10 w-1/3 overflow-hidden rounded bg-gray-300">
        <span className="absolute inset-0 block animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent" />
      </div>
      <div className="w-full max-w-3xl">
        <table className="min-w-full overflow-hidden rounded-lg border-2 border-indigo-300 bg-white/80">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t border-indigo-100">
                <td className="px-4 py-2">
                  <div className="relative h-4 w-8 overflow-hidden rounded bg-gray-200">
                    <span className="absolute inset-0 block animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent" />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200">
                    <span className="absolute inset-0 block animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent" />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-200">
                    <span className="absolute inset-0 block animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
