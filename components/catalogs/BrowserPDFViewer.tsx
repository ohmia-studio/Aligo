'use client';

import Link from 'next/link';
import { useState } from 'react';

interface BrowserPDFViewerProps {
  pdfUrl: string;
  catalogName: string;
}

export default function BrowserPDFViewer({
  pdfUrl,
  catalogName,
}: BrowserPDFViewerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  console.log('BrowserPDFViewer - Loading PDF:', pdfUrl);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Mobile: Sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop con blur */}
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar content */}
          <div className="absolute top-0 left-0 h-full w-80 bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="truncate text-lg font-semibold text-gray-900">
                {catalogName}
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-500 hover:text-gray-700"
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
              </button>
            </div>

            {/* Funcionalidades disponibles */}
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-700">
                Funcionalidades:
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li> Zoom nativo (pellizco/pinch)</li>
                <li> Búsqueda táctil</li>
                <li> Selección de texto</li>
                <li> Navegación táctil</li>
                <li> Compartir desde browser</li>
              </ul>
            </div>

            {/* Enlaces útiles */}
            <div className="space-y-2">
              <Link
                href={
                  pdfUrl.includes('/api/manuales')
                    ? '/dashboard/manuales'
                    : '/dashboard/catalogos'
                }
                className="block rounded bg-gray-500 px-3 py-2 text-center text-sm text-white hover:bg-gray-600"
                onClick={() => setShowSidebar(false)}
              >
                ← Volver a{' '}
                {pdfUrl.includes('/api/manuales') ? 'Manuales' : 'Catálogos'}
              </Link>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded bg-green-500 px-3 py-2 text-center text-sm text-white hover:bg-green-600"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Fixed sidebar */}
      <div className="hidden w-80 bg-white p-4 shadow-lg md:block">
        <h2 className="mb-4 truncate text-lg font-semibold text-gray-900">
          {catalogName}
        </h2>

        {/* Funcionalidades disponibles */}
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-700">Funcionalidades:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li> Zoom nativo (Ctrl + +/-)</li>
            <li> Búsqueda (Ctrl + F)</li>
            <li> Selección de texto</li>
            <li> Navegación con scroll</li>
            <li> Imprimir (Ctrl + P)</li>
          </ul>
        </div>

        {/* Enlaces útiles */}
        <div className="space-y-2">
          <Link
            href={
              pdfUrl.includes('/api/manuales')
                ? '/dashboard/manuales'
                : '/dashboard/catalogos'
            }
            className="block rounded bg-gray-500 px-3 py-2 text-center text-sm text-white hover:bg-gray-600"
          >
            ← Volver a{' '}
            {pdfUrl.includes('/api/manuales') ? 'Manuales' : 'Catálogos'}
          </Link>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded bg-green-500 px-3 py-2 text-center text-sm text-white hover:bg-green-600"
          >
            Abrir en nueva pestaña
          </a>
        </div>
      </div>

      {/* Área del PDF */}
      <div className="flex flex-1 flex-col">
        {/* Mobile: Top bar with menu button */}
        <div className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="max-w-[200px] truncate text-sm font-medium">
              {catalogName}
            </span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700"
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* PDF Container */}
        <div className="flex-1 p-2 md:p-4">
          <div className="h-full w-full">
            <iframe
              src={pdfUrl}
              className="h-full w-full rounded border shadow-sm"
              title={catalogName}
              onLoad={() => console.log('PDF cargado exitosamente en iframe')}
              onError={() => console.error('Error cargando PDF en iframe')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
