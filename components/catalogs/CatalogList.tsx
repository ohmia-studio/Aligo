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
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2">No hay catálogos subidos</p>
          <p className="text-sm">
            Sube tu primer catálogo usando el formulario
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
              </div>

              <div className="ml-4 flex items-center space-x-2">
                {onView ? (
                  <button
                    onClick={() => onView(catalog)}
                    className="text-sm font-medium text-green-600 hover:text-green-800"
                    title="Ver PDF"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={`/dashboard/catalogos/ver?key=${encodeURIComponent(catalog.fullKey)}&name=${encodeURIComponent(catalog.name)}`}
                    className="text-sm font-medium text-green-600 hover:text-green-800"
                    title="Ver PDF"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </a>
                )}

                <button
                  onClick={() => onDownload(catalog)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
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
                    className="text-sm font-medium text-red-600 hover:text-red-800"
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
