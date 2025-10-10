'use client';

import { useState } from 'react';
import { altaEmpleadoAction } from '@/features/employees/actions/signUp';
import { toast } from 'sonner';

export default function AltaEmpleadoPage() {
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await altaEmpleadoAction(formData);

    if (result?.message) {
      toast[result.status === 200 ? 'success' : 'error'](result.message);
    }

    if (result?.status === 200) {
      setForm({ dni: '', nombre: '', apellido: '', email: '' });
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold text-indigo-700">
        Alta de Empleado
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="dni"
          value={form.dni}
          onChange={handleChange}
          placeholder="DNI"
          required
          className="w-full rounded border px-2 py-1"
        />
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full rounded border px-2 py-1"
        />
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          required
          className="w-full rounded border px-2 py-1"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full rounded border px-2 py-1"
        />

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
