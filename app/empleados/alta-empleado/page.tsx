'use client';

import { useState } from 'react';

export default function AltaEmpleadoPage() {
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    dni: '',
    email: '',
    nombre: '',
    apellido: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch('/api/empleados/alta-empleado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMensaje(JSON.stringify(data));
    setForm({ dni: '', email: '', nombre: '', apellido: '' });
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Alta Empleado</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="dni"
          value={form.dni}
          onChange={handleChange}
          placeholder="DNI"
          className="w-full rounded border px-2 py-1"
          required
        />
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full rounded border px-2 py-1"
          required
        />
        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full rounded border px-2 py-1"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full rounded border px-2 py-1"
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white"
        >
          Registrar
        </button>
      </form>
      {mensaje && <p className="mt-4">Respuesta: {mensaje}</p>}
    </div>
  );
}
