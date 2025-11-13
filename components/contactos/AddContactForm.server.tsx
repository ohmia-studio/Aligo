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
      redirect('/dashboard/admin/contactos');
    } catch (e) {}
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error('insertContactServerAction error', err);
    throw err;
  }
}

export default function AddContactForm() {
  return (
    <section className="mb-6 w-full max-w-4xl">
      <form
        action={insertContactServerAction}
        className="flex max-w-[900px] flex-col gap-4 rounded-lg border bg-white p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
          <label htmlFor="nombre" className="block sm:col-span-6">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Nombre *
            </span>
            <input
              id="nombre"
              name="nombre"
              required
              type="text"
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
            />
          </label>

          <label htmlFor="telefono" className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono
            </span>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
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
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white"
          >
            Crear contacto
          </button>
        </div>
      </form>
    </section>
  );
}
