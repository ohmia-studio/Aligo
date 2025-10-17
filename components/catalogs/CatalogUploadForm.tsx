'use client';
import { uploadCatalogAction } from '@/features/catalogs/catalogs';
import { useState } from 'react';
import { toast } from 'sonner';

interface CatalogUploadFormProps {
  onUploadSuccess?: () => void;
}

export default function CatalogUploadForm({
  onUploadSuccess,
}: CatalogUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo PDF');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await uploadCatalogAction(formData);

      if (result.success) {
        toast.success(result.message);
        // Limpiar formulario
        setSelectedFile(null);
        (e.target as HTMLFormElement).reset();
        // Notificar al componente padre que la subida fue exitosa
        onUploadSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error inesperado al subir el archivo');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Subir Catálogo PDF
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="catalog-file"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Seleccionar archivo PDF
          </label>
          <input
            id="catalog-file"
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
            'Subir Catálogo'
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
