export default function CatalogListSkeleton() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Catálogos Subidos (Cargando...)
      </h2>
      <div className="mb-4">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>

            <div className="ml-4 flex items-center space-x-2">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200"></div>
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
