import { updateContact } from '@/features/contactos/contactRepository';
import { redirect } from 'next/navigation';

export async function updateContactServerAction(formData: FormData) {
  'use server';
  console.log(formData);
  const id = formData.get('id');
  const nombre = formData.get('nombre');
  const telefono = formData.get('telefono');
  const email = formData.get('email');
  if (!id || !nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    throw new Error('El nombre es requerido');
  }
  const payload: any = {
    id,
    nombre: String(nombre).trim(),
    telefono: telefono ? String(telefono).trim() : undefined,
    email: email ? String(email).trim() : undefined,
  };
  const { error } = await updateContact(payload);
  if (error) throw new Error('Error actualizando contacto');
  redirect('/dashboard/admin/contactos');
}

export default function EditContactForm({ contact }: { contact: any }) {
  return (
    <form
      action={updateContactServerAction}
      className="flex flex-col gap-2 rounded-lg border bg-white p-6 shadow-lg"
      style={{ maxWidth: '900px' }}
    >
      <input type="hidden" name="id" value={contact.id} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            name="nombre"
            required
            defaultValue={contact.nombre ?? ''}
            className="w-full rounded border px-3 py-2 text-black"
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            name="telefono"
            defaultValue={contact.telefono ?? ''}
            className="w-full rounded border px-3 py-2 text-black"
          />
        </div>
        <div className="w-64">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={contact.email ?? ''}
            className="w-full rounded border px-3 py-2 text-black"
          />
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
