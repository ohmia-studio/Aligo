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
    <div className="bg-container w-full max-w-md rounded-xl p-8 shadow-lg">
      <h2 className="text-primary mb-6 text-center text-3xl font-bold">
        Registrar empleado
      </h2>

      <form onSubmit={handleSubmit} className="text-base-color/80 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">DNI</span>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="Ej. 26345678"
            required
            className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Juan"
            required
            className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Apellido</span>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Ej. Pérez"
            required
            className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required
            className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Teléfono</span>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+54 9 11 1234 5678"
            required
            className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-base-color-foreground w-full rounded px-4 py-2 transition duration-150 hover:scale-105 hover:cursor-pointer hover:brightness-105"
        >
          {loading ? 'Enviando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}
