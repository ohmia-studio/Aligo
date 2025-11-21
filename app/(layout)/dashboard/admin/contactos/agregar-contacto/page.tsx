'use server';
import AddContactForm from '@/components/contactos/AddContactForm.server';
import Link from 'next/link';

export default async function AgregarContactoPage() {
  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base-color text-2xl font-bold">Agregar contacto</h1>
        <Link
          href="/dashboard/admin/contactos"
          className="text-base-color/60 text-sm hover:underline"
        >
          Volver a contactos
        </Link>
      </div>

      <AddContactForm />
    </main>
  );
}
