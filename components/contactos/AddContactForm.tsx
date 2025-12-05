'use client';

import Alert from '@/components/ui/FormAlert';
import { insertContactAction } from '@/features/contactos/insertContact';
import { updateContactAction } from '@/features/contactos/updateContact';
import {
  Contact,
  ContactError,
  ContactForm,
} from '@/interfaces/contact-interfaces';
import { normalizePhoneNumber, validateEmail } from '@/lib/validations';
import { useEffect, useState } from 'react';

export default function AddContactForm({
  onSuccess,
  contact,
}: {
  onSuccess?: () => void;
  contact?: Contact;
}) {
  const getDisplayPhone = (phone?: string) => {
    if (!phone) return '';
    // Si viene con +54, sacarlo para mostrar al usuario
    return phone.startsWith('+54') ? phone.slice(3) : phone;
  };

  const isEditing = contact !== undefined;

  const [form, setForm] = useState<ContactForm>({
    nombre: contact?.nombre || '',
    telefono: getDisplayPhone(contact?.telefono) || '',
    email: contact?.email || '',
  });
  const [telefonoNormalized, setTelefonoNormalized] = useState('');
  const [errors, setErrors] = useState<ContactError>({});
  const [loading, setLoading] = useState(false);
  // Validación en vivo del email
  useEffect(() => {
    const email = form.email.trim();
    if (!email) {
      setErrors((prev) => ({ ...prev, email: null }));
      return;
    }
    const emailError = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: emailError }));
  }, [form.email]);

  // Validación en vivo del teléfono
  useEffect(() => {
    const raw = form.telefono.trim();
    if (raw === '') {
      setTelefonoNormalized('');
      setErrors((prev) => ({ ...prev, telefono: null }));
      return;
    }
    const { number, error } = normalizePhoneNumber(raw);
    setTelefonoNormalized(number ?? '');
    setErrors((prev) => ({ ...prev, telefono: error ?? null }));
  }, [form.telefono]);

  const validarCampos = () => {
    const nextErrors: typeof errors = {};

    if (!form.nombre || form.nombre.trim().length < 2) {
      nextErrors.nombre = 'El nombre es requerido (mínimo 2 caracteres)';
    }
    if (form.telefono && errors.telefono) {
      nextErrors.telefono = errors.telefono;
    }
    if (form.email && errors.email) {
      nextErrors.email = errors.email;
    }
    // Si ambos campos están vacíos, mostrar error general
    if (!form.telefono.trim() && !form.email.trim()) {
      nextErrors.general = 'Un contacto debe poseer mail y/o teléfono';
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (!validarCampos()) return;

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        telefono: telefonoNormalized || undefined,
        email: form.email?.trim() || undefined,
      };

      const result = isEditing
        ? await updateContactAction({ ...payload, id: Number(contact.id) })
        : await insertContactAction(payload);

      if (!result || result.status !== 200) {
        // Error del servidor - mostrar mensaje general simplificado
        const msg = isEditing
          ? 'Error al editar contacto'
          : 'Error al registrar contacto';
        setErrors((prev) => ({ ...prev, general: msg }));
        setLoading(false);
        return;
      }

      if (!isEditing) {
        setForm({ nombre: '', telefono: '', email: '' });
      }
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: isEditing
          ? 'Error al editar contacto'
          : 'Error al registrar contacto',
      }));
      setLoading(false);
    }
  }

  return (
    <section className="mb-6 w-full max-w-4xl">
      {errors.general && (
        <Alert
          type="error"
          message={String(errors.general)}
          onClose={() => setErrors((p) => ({ ...p, general: null }))}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-container text-base-color/80 flex flex-col gap-2 rounded-lg border p-6 shadow-lg"
        style={{ maxWidth: '900px' }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre: e.target.value }))
              }
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
            {errors.nombre && (
              <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          <div className="w-40">
            <label className="mb-1 block text-sm font-medium">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="tel"
              placeholder="911xxxxxxx"
              maxLength={15}
              value={form.telefono}
              onChange={(e) =>
                setForm((p) => ({ ...p, telefono: e.target.value }))
              }
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
            {errors.telefono && (
              <p className="mt-2 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

          <div className="w-64">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={
              loading ||
              !!errors.telefono ||
              !!errors.email ||
              !form.nombre.trim()
            }
            className="bg-primary text-base-color-foreground rounded px-4 py-2 transition duration-150 hover:scale-105 hover:cursor-pointer hover:brightness-105 disabled:opacity-60"
          >
            {loading
              ? isEditing
                ? 'Guardando...'
                : 'Creando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear contacto'}
          </button>
        </div>
      </form>
    </section>
  );
}
