import AddContactToggle from '@/components/contactos/AddContactToggle';
import { ContactList } from '@/components/contactos/ContactList';
import { ContactListSkeleton } from '@/components/contactos/ContactListSkeleton';
import { listContactsAction } from '@/features/contactos/listContacts';
import { Suspense } from 'react';

async function ContactListContent() {
  const { data: contactos, status, message } = await listContactsAction();
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-black">
        Listado de contactos
      </h1>

      <AddContactToggle />

      <div className="mt-6">
        {status !== 200 ? (
          <div className="p-8 text-center text-red-600">
            {message || 'Error al cargar contactos'}
          </div>
        ) : Array.isArray(contactos) && contactos.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay contactos registrados.
          </div>
        ) : (
          <ContactList contactos={contactos || []} />
        )}
      </div>
    </div>
  );
}

export default function ContactosPage() {
  return (
    <Suspense fallback={<ContactListSkeleton />}>
      <ContactListContent />
    </Suspense>
  );
}
