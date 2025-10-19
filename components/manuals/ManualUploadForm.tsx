'use client';

import { uploadManualAction } from '@/features/manuals/actions/uploadManual';
import { useState } from 'react';
import { toast } from 'sonner';

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
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Subir Manual PDF
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="manual-title"
            className="mb-2 block text-sm font-medium text-gray-700"
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
            className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="manual-file"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Seleccionar archivo PDF
          </label>
          <input
            id="manual-file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado:{' '}
              <span className="font-medium">{selectedFile.name}</span>
              <span className="ml-2 text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <svg
                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subiendo...
            </>
          ) : (
            'Subir Manual'
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Solo archivos PDF</p>
        <p>• El archivo se guardará de forma segura</p>
      </div>
    </div>
  );
}
