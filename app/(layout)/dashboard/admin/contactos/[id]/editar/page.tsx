import EditContactForm from '@/components/contactos/EditContactForm.server';
import { getContactById } from '@/features/contactos/contactRepository';
import Link from 'next/link';

export default async function EditContactPage(context: {
  params: { id: string };
}) {
  const result = await getContactById(context.params.id);
  const contact = result?.data;
  if (!contact) {
    return (
      <main className="mx-auto w-full max-w-3xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-base-color text-2xl font-bold">
            Contacto no encontrado
          </h1>
          <Link
            href="/dashboard/admin/contactos"
            className="text-base-color/60 text-sm hover:underline"
          >
            Volver a contactos
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base-color text-2xl font-bold">Editar contacto</h1>
        <Link
          href="/dashboard/admin/contactos"
          className="text-base-color/60 text-sm hover:underline"
        >
          Volver a contactos
        </Link>
      </div>
      <EditContactForm contact={contact} />
    </main>
  );
}
