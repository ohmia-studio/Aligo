'use client';

import { BrowserPDFViewerProps } from '@/interfaces/documents-interfaces';
import { ArrowUpRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
export default function BrowserPDFViewer({
  pdfUrl,
  catalogName,
  backUrl,
}: BrowserPDFViewerProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden md:gap-4">
      <div className="flex w-full flex-col gap-2 p-4 md:p-0">
        <div className="mb-4 flex gap-3">
          {backUrl && (
            <Button
              variant={'outline'}
              className="text-base-color w-fit hover:cursor-pointer"
            >
              <Link href={backUrl} className="flex items-center gap-2">
                <ChevronLeft />
                Volver
              </Link>
            </Button>
          )}
          <Button
            variant={'link'}
            className="text-base-color-foreground hover:cursor-pointer"
          >
            <Link href={pdfUrl} className="flex items-center gap-1">
              Nueva pestaña
              <ArrowUpRight size={32} />
            </Link>
          </Button>
        </div>

        <h2 className="text-base-color truncate text-lg font-semibold">
          {catalogName}
        </h2>
      </div>

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
