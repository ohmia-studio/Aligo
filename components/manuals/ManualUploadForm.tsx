'use client';

import { uploadManualAction } from '@/features/manuals/actions/uploadManual';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  onUploadSuccess?: () => void;
};

export default function ManualUploadForm({ onUploadSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      toast.error('Título y archivo son obligatorios');
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
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="mt-1 w-full"
          required
          disabled={loading}
        />
        {file && (
          <div className="mt-2 text-sm text-gray-600">
            Seleccionado: {file.name}
          </div>
        )}
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Subiendo...' : 'Subir manual'}
        </button>
      </div>
    </form>
  );
}
