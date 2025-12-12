'use client';

import { altaEmpleadoAction } from '@/features/employees/actions/signUp';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type Employee = {
  id?: string | number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};

export default function EmployeeForm({
  employee,
  onSuccess,
  onCancel,
}: {
  employee?: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Employee>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) setForm(employee);
    else
      setForm({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
      });
  }, [employee]);

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
        toast[result.status === 200 ? 'success' : 'error'](
          employee ? `Empleado actualizado: ${result.message}` : result.message
        );
      }

      if (result?.status === 200) {
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-container w-full max-w-4xl rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-primary text-xl font-bold">
          {employee ? 'Editar empleado' : 'Registrar empleado'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-base-color/80 hover:text-base-color text-sm"
          >
            Cerrar
          </button>
        )}
      </div>

      {/* Grid 2 columnas en md+, 1 columna en móviles */}
      <form onSubmit={handleSubmit} className="text-base-color/80">
        {/* En edición, incluir el ID para que el backend actualice */}
        {employee?.id !== undefined && (
          <input type="hidden" name="id" value={String(employee.id)} />
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">DNI</span>
              {employee?.id && (
                <span className="text-xs font-semibold text-orange-500">
                  No editable
                </span>
              )}
            </div>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej. 26345678"
              required
              className={`border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2 transition ${
                employee?.id
                  ? 'bg-base-color/5 cursor-not-allowed opacity-60'
                  : ''
              }`}
              disabled={loading}
              readOnly={!!employee?.id}
            />
          </label>

          <label className="flex flex-col gap-1">
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

          <label className="flex flex-col gap-1">
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

          <label className="flex flex-col gap-1">
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

          {/* Teléfono ocupa toda la fila en md+ para balancear */}
          <label className="flex flex-col gap-1 md:col-span-2">
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
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="border-base-color/30 text-base-color hover:bg-container-foreground w-full rounded border px-4 py-2 md:w-auto"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-base-color-foreground w-full rounded px-4 py-2 transition duration-150 hover:scale-[1.02] hover:cursor-pointer hover:brightness-105 md:w-auto"
          >
            {loading
              ? employee
                ? 'Guardando...'
                : 'Enviando...'
              : employee
                ? 'Guardar cambios'
                : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
