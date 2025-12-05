'use client';

import { Result } from '@/interfaces/server-response-interfaces';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

type Props = {
  type: 'Manual' | 'Catalogo';
  onUploadAction: (formData: FormData) => Promise<Result>;
  onUploadSuccess: () => void;
};

// 1. Pasar el Action por parametro
// 2. Revisar si conviene o no dejarle el campo 'title' en el formData
// 3. Agregar los textos que deben incluirse por parametro.
// 4. Revisar el tipo que devuelve el action. En uno devuelve status y en otro un boolean success

export default function ResourcesUploadForm({
  type,
  onUploadSuccess,
  onUploadAction,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo PDF');
      return;
    }

    // Validar que sea un PDF
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    // Validar tamaño del archivo (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB en bytes
    if (selectedFile.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo permitido: 50MB');
      return;
    }

    // Mostrar warning para archivos grandes
    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB
      toast.info('Archivo grande detectado. La subida puede demorarse.');
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Agregar prefijo para que el action sepa si es catalogs o manuals
      const prefix = type === 'Catalogo' ? 'catalogs' : 'manuales';
      formData.append('prefix', prefix);

      const result = await onUploadAction(formData);

      if (result?.status === 200) {
        toast.success(result.message || 'Subido'); // Aclarar si manual o catalogo subido
        // Limpiar formulario
        setSelectedFile(null);
        (e.target as HTMLFormElement).reset();
        // Notificar al componente padre
        onUploadSuccess?.();
      } else {
        toast.error(result?.message || 'Error al subir'); // Aclarar si manual o catalogo subido
      }
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado al subir el archivo');
    } finally {
      setIsUploading(false);
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
            {selectedFile ? (
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
              disabled={isUploading}
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
