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
        className="bg-container text-base-color/80 flex flex-col gap-2 rounded-lg border p-6 shadow-lg"
        style={{ maxWidth: '900px' }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              id="nombre"
              name="nombre"
              required
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
          </div>
          <div className="w-40">
            <label className="mb-1 block text-sm font-medium">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
          </div>
          <div className="w-64">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="border-base-color/20 focus:text-base-color w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-base-color-foreground rounded px-4 py-2 transition duration-150 hover:scale-105 hover:cursor-pointer hover:brightness-105"
          >
            Crear contacto
          </button>
        </div>
      </form>
    </section>
  );
}
