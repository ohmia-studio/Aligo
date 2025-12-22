'use client';

import { uploadToR2Direct } from '@/features/storage/client';
import { UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

type Props = {
  type: 'Manual' | 'Catalogo';
  onUploadSuccess: () => void;
};

export default function ResourcesUploadForm({ type, onUploadSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const isProcessingRef = useRef(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoadingFile(true);
      // Pequeña pausa para permitir que el navegador procese el archivo
      await new Promise((resolve) => setTimeout(resolve, 100));
      setSelectedFile(file);
      setIsLoadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Evitar múltiples envíos
    if (isUploading || isProcessingRef.current) return;
    isProcessingRef.current = true;

    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo PDF');
      isProcessingRef.current = false;
      return;
    }

    // Validar que sea un PDF
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      isProcessingRef.current = false;
      return;
    }

    // Validar tamaño del archivo (150MB máximo)
    const maxSize = 150 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo permitido: 150MB');
      isProcessingRef.current = false;
      return;
    }

    setIsUploading(true);

    try {
      const prefix = type === 'Catalogo' ? 'catalogs' : 'manuales';
      const result = await uploadToR2Direct(selectedFile, prefix);

      if (result?.status === 200) {
        toast.success(result.message || 'Subido');
        setSelectedFile(null);
        (e.target as HTMLFormElement).reset();

        setTimeout(() => {
          setIsUploading(false);
          isProcessingRef.current = false;
          onUploadSuccess?.();
        }, 500);
      } else {
        toast.error(result?.message || 'Error al subir');
        setIsUploading(false);
        isProcessingRef.current = false;
      }
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado al subir el archivo');
      setIsUploading(false);
      isProcessingRef.current = false;
    }
  };

  // Claramente los nombres de los ID o de props como htmlFor pueden o ser uno genérico o variar entre ambos.
  return (
    <div className="bg-container-foreground shadow-shadow-color rounded-lg p-6 shadow-md">
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        Subir {type} PDF
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <section>
          <label
            htmlFor="manual-file"
            className="text-foreground/80 mb-2 block text-sm font-medium"
          >
            Seleccionar archivo PDF
          </label>
          <div className="border-base-color/70 flex h-auto w-full place-content-center items-center rounded-md border-2 border-dashed bg-white/10 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            {isLoadingFile ? (
              <p className="text-base-color/80 absolute flex items-center gap-2 p-2 text-sm font-medium">
                <Spinner className="h-4 w-4" />
                Cargando...
              </p>
            ) : selectedFile ? (
              <p className="text-base-color/80 absolute h-auto max-w-[16rem] truncate p-2 text-sm font-medium">
                {selectedFile.name}
              </p>
            ) : (
              <UploadIcon className="absolute opacity-70" />
            )}
            <input
              id="manual-file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isUploading || isLoadingFile}
              className="min-h-12 w-full opacity-0 hover:cursor-pointer disabled:cursor-not-allowed"
              required
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="bg-primary text-base-color-foreground flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:cursor-pointer hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <div className="text-base-color-foreground flex flex-row gap-2">
              <Spinner className="h-auto" />
              <p>Subiendo...</p>
            </div>
          ) : (
            'Subir ' + type
          )}
        </button>
      </form>

      <div className="text-base-color/60 mt-4 text-xs">
        <p>• Solo archivos PDF</p>
        <p>• El archivo se guardará de forma segura</p>
      </div>
    </div>
  );
  // Aclarar requisitos segun el tipo o requisitos genéricos para ambos casos...
}
