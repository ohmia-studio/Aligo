'use client';

import { uploadManualAction } from '@/features/manuals/actions/uploadManual';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

type Props = {
  onUploadSuccess?: () => void;
};

export default function ManualUploadForm({ onUploadSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo PDF');
      return;
    }
    if (!title.trim()) {
      toast.error('Por favor ingresa un título');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim());

      const result = await uploadManualAction(formData);

      if (result?.status === 200) {
        toast.success(result.message || 'Manual subido');
        // Limpiar formulario
        setSelectedFile(null);
        setTitle('');
        (e.target as HTMLFormElement).reset();
        // Notificar al componente padre
        onUploadSuccess?.();
      } else {
        toast.error(result?.message || 'Error al subir manual');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-container-foreground shadow-shadow-color rounded-lg p-6 shadow-md">
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        Subir Manual PDF
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <section>
          <label
            htmlFor="manual-title"
            className="text-foreground/80 mb-2 block text-sm font-medium"
          >
            Título
          </label>
          <input
            id="manual-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del manual"
            disabled={isUploading}
            className="text-foreground border-base-color placeholder-base-color focus:border-accent focus:ring-accent block w-full rounded-md border px-3 py-2 text-sm placeholder:opacity-35"
            required
          />
        </section>

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
            'Subir Manual'
          )}
        </button>
      </form>

      <div className="text-base-color/60 mt-4 text-xs">
        <p>• Solo archivos PDF</p>
        <p>• El archivo se guardará de forma segura</p>
      </div>
    </div>
  );
}
