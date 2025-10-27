import { insertContact } from '@/features/contactos/contactRepository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Server action must be top-level and explicitly marked with the directive
export async function insertContactServerAction(
  formData: FormData
): Promise<void> {
  'use server';
  const nombre = formData.get('nombre');
  const telefono = formData.get('telefono');
  const email = formData.get('email');

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    throw new Error('El nombre es requerido');
  }

  try {
    const payload: any = { nombre: String(nombre).trim() };
    if (telefono) payload.telefono = String(telefono).trim();
    if (email) payload.email = String(email).trim();

    const { data, error, status, message } = await insertContact(payload);
    if (error) {
      console.error('insertContact error', error);
      throw new Error(message ?? 'Error creando contacto');
    }

    try {
      revalidatePath('/dashboard/admin/contactos');
    } catch (e) {
      // ignore if revalidation isn't available
    }
    redirect('/dashboard/admin/contactos');
  } catch (err) {
    console.error('Error in insertContactServerAction', err);
    throw err;
  }
}

export default function AddContactForm() {
  return (
    <div className="mb-6 w-full max-w-4xl">
      <form
        action={insertContactServerAction}
        className="flex flex-col gap-2 rounded-lg border bg-white p-6 shadow-lg"
        style={{ maxWidth: '900px' }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              name="nombre"
              required
              className="w-full rounded border px-3 py-2 text-black"
            />
          </div>
          <div className="w-40">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              name="telefono"
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
              className="w-full rounded border px-3 py-2 text-black"
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Crear contacto
          </button>
        </div>
      </form>
    </div>
  );
}
