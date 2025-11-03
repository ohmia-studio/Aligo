'use client';
import { CatalogListProps } from '@/interfaces/catalogs-interfaces';

export default function CatalogList({
  catalogs,
  onDelete,
  onView,
  onDownload,
  onRefresh,
}: CatalogListProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Catálogos Subidos ({catalogs.length})
      </h2>

      {catalogs.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          No hay catálogos subidos aún.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {catalog.name}
                </p>
                <p className="text-xs text-gray-500">
                  {catalog.size} •{' '}
                  {new Date(catalog.lastModified).toLocaleDateString()}
                </p>
                {/* Botón Ver catálogo debajo del nombre */}
                <div className="mt-3">
                  {onView ? (
                    <button
                      onClick={() => onView(catalog)}
                      className="w-full cursor-pointer rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
                    >
                      Ver catálogo
                    </button>
                  ) : (
                    <a
                      href={`/dashboard/catalogos/ver?key=${encodeURIComponent(
                        catalog.fullKey
                      )}&name=${encodeURIComponent(catalog.name)}`}
                      className="block w-full cursor-pointer rounded bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white shadow transition hover:bg-green-700"
                    >
                      Ver catálogo
                    </a>
                  )}
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => onDownload(catalog)}
                  className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                  title="Descargar"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>

                {onDelete && (
                  <button
                    onClick={() => onDelete(catalog.id)}
                    className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ↻ Actualizar lista
        </button>
      )}
    </div>
  );
}
