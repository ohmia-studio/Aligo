'use client';

import { uploadManualAction } from '@/features/manuals/actions/uploadManual';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  onUploadSuccess?: () => void;
};

export default function ManualUploadForm({ onUploadSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      toast.error('Título y archivo son obligatorios');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await uploadManualAction(formData);
      if (res?.status === 200) {
        toast.success(res.message || 'Manual subido');
        setTitle('');
        setFile(null);
        formRef.current?.reset();
        if (onUploadSuccess) onUploadSuccess();
        else router.refresh();
      } else {
        toast.error(res?.message || 'Error subiendo manual');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado al subir manual');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-4 rounded bg-white p-6 shadow"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Subir manual (PDF)
      </h2>

      <label className="block">
        <span className="text-sm text-gray-600">Título</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="Título del manual"
          required
          disabled={loading}
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-600">Archivo</span>

        <div className="mt-1 flex items-center gap-3">
          <input
            id="manual-file"
            name="file"
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-medium"
            required
            disabled={loading}
          />
        </div>

        {file && (
          <div className="mt-2 text-sm text-gray-600">
            Seleccionado: <span className="font-medium">{file.name}</span> ·{' '}
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="text-sm">Subiendo…</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4M8 8l4-4 4 4"
                />
              </svg>
              <span className="text-sm">Subir manual</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
