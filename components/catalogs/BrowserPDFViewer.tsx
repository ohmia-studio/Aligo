'use client';

import { useState } from 'react';

interface BrowserPDFViewerProps {
  pdfUrl: string;
  catalogName: string;
  downloadUrl?: string;
  backUrl?: string;
  backLabel?: string;
  homeUrl?: string;
}

export default function BrowserPDFViewer({
  pdfUrl,
  catalogName,
  downloadUrl,
  backUrl,
  backLabel,
  homeUrl,
}: BrowserPDFViewerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  console.log('BrowserPDFViewer - Loading PDF:', pdfUrl);
  return (
    <div
      className="relative flex w-full overflow-hidden"
      style={{ height: 'calc(100vh - 140px)' }}
    >
      {/* Sidebar (solo desktop) */}
      <div className="hidden w-80 flex-shrink-0 flex-col bg-white p-4 shadow-lg md:flex">
        {/* Navegación principal arriba */}
        <div className="mb-4 flex flex-col gap-3">
          <h2 className="truncate text-lg font-semibold text-gray-900">
            {catalogName}
          </h2>
          {backUrl && (
            <a
              href={backUrl}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>{backLabel}</span>
            </a>
          )}
        </div>
        <div className="mb-6 flex flex-col gap-2">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">Descargar</span>
            </a>
          )}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:text-blue-700"
            style={{ boxShadow: 'none' }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
              />
            </svg>
            <span className="hidden sm:inline">Abrir en nueva pestaña</span>
          </a>
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-700">Funcionalidades:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li> Zoom nativo (Ctrl + +/- o pellizco)</li>
            <li> Búsqueda (Ctrl + F o táctil)</li>
            <li> Selección de texto</li>
            <li> Navegación con scroll/táctil</li>
            <li> Imprimir (Ctrl + P)</li>
            <li> Compartir desde browser</li>
          </ul>
        </div>
      </div>

      {/* Mobile: botón menú hamburguesa */}
      <div className="absolute top-4 right-4 z-20 md:hidden">
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-xl hover:bg-gray-50 hover:text-gray-900"
          aria-label="Abrir menú"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="text-sm font-medium">Menú</span>
        </button>
      </div>

      {/* Mobile: sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop con blur */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
          {/* Sidebar overlay */}
          <div className="relative z-10 flex h-full w-80 flex-col bg-white p-4 shadow-lg">
            {/* Navegación principal arriba */}
            <div className="mb-4 flex flex-col gap-3">
              <h2 className="truncate text-lg font-semibold text-gray-900">
                {catalogName}
              </h2>
              {backUrl && (
                <a
                  href={backUrl}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>{backLabel}</span>
                </a>
              )}
            </div>
            <div className="mb-6 flex flex-col gap-2">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Descargar</span>
                </a>
              )}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:text-blue-700"
                style={{ boxShadow: 'none' }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
                  />
                </svg>
                <span>Abrir en nueva pestaña</span>
              </a>
            </div>
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-700">
                Funcionalidades:
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li> Zoom nativo (Ctrl + +/- o pellizco)</li>
                <li> Búsqueda (Ctrl + F o táctil)</li>
                <li> Selección de texto</li>
                <li> Navegación con scroll/táctil</li>
                <li> Imprimir (Ctrl + P)</li>
                <li> Compartir desde browser</li>
              </ul>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="mt-auto flex items-center gap-2 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar menú"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      )}
      {/* Área del PDF */}
      <div className="h-full flex-1 overflow-hidden bg-white">
        <iframe
          src={pdfUrl}
          className="h-full w-full"
          title={catalogName}
          style={{
            border: 'none',
            outline: 'none',
            height: '100%',
            width: '100%',
            display: 'block',
          }}
          allowFullScreen
          onLoad={() => console.log('PDF cargado exitosamente en iframe')}
          onError={() => console.error('Error cargando PDF en iframe')}
        />
      </div>
    </div>
  );
}
