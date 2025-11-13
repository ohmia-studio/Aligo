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
  // Interpret empty strings as an explicit intention to clear the field.
  // FormData.get returns '' (empty string) when the input is present but empty,
  // so we should include that value in the payload (not treat it as "no change").
  const telefonoVal =
    typeof telefono === 'string' ? String(telefono).trim() : undefined;
  const emailVal = typeof email === 'string' ? String(email).trim() : undefined;

  const payload: any = {
    id,
    nombre: String(nombre).trim(),
    // If the user cleared the input, telefonoVal/emailVal will be '' and we
    // include that so the backend can update the field to an empty value.
    telefono: typeof telefonoVal === 'undefined' ? undefined : telefonoVal,
    email: typeof emailVal === 'undefined' ? undefined : emailVal,
  };
  const { error } = await updateContact(payload);
  if (error) throw new Error('Error actualizando contacto');
  redirect('/dashboard/admin/contactos');
}

export default function EditContactForm({ contact }: { contact: any }) {
  return (
    <section className="mb-6 w-full max-w-4xl">
      <form
        action={updateContactServerAction}
        className="flex max-w-[900px] flex-col gap-4 rounded-lg border bg-white p-6 shadow-lg"
      >
        <input type="hidden" name="id" value={contact.id} />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
          <label htmlFor="nombre" className="block sm:col-span-6">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Nombre *
            </span>
            <input
              id="nombre"
              name="nombre"
              required
              defaultValue={contact.nombre ?? ''}
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </label>

          <label htmlFor="telefono" className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono
            </span>
            <input
              id="telefono"
              name="telefono"
              defaultValue={contact.telefono ?? ''}
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </label>

          <label htmlFor="email" className="block sm:col-span-4">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </span>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={contact.email ?? ''}
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </label>
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
    </section>
  );
}
