'use client';

import { altaEmpleadoAction } from '@/features/employees/actions/signUp';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AltaEmpleadoPage() {
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
  };

  const validar = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!form.dni || form.dni.replace(/\D/g, '').length < 6) {
      toast.error('DNI inválido');
      return false;
    }
    if (!form.nombre || form.nombre.length < 2) {
      toast.error('Nombre demasiado corto');
      return false;
    }
    if (!form.apellido || form.apellido.length < 2) {
      toast.error('Apellido demasiado corto');
      return false;
    }
    if (!form.email || !emailRegex.test(form.email)) {
      toast.error('Email inválido');
      return false;
    }
    if (!form.telefono || !/^[0-9+\s()-]{6,20}$/.test(form.telefono)) {
      toast.error('Teléfono inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await altaEmpleadoAction(formData);

      if (result?.message) {
        toast[result.status === 200 ? 'success' : 'error'](result.message);
      }

      if (result?.status === 200) {
        setForm({ dni: '', nombre: '', apellido: '', email: '', telefono: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          Registrar empleado
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">DNI</span>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej. 26345678"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Nombre</span>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Apellido</span>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ej. Pérez"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Teléfono</span>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+54 9 11 1234 5678"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
