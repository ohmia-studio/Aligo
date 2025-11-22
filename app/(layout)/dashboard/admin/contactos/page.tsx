import { ContactListSkeleton } from '@/components/contactos/ContactListSkeleton';
import Contacts from '@/components/contactos/contacts';
import { listContactsAction } from '@/features/contactos/listContacts';

import { Suspense } from 'react';
/*
async function Contacts() {
      const { data: contactos, status, message } = await listContactsAction();
 
  return (
    <div className="md:px-8">
      <h1 className="text-base-color mb-6 text-2xl font-bold">
        Listado de contactos
      </h1>

      <AddContactToggle />

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
  );
  
}
*/
export default async function ContactosPage() {
  const resultContacts = await listContactsAction();
  return (
    <>
      <Suspense fallback={<ContactListSkeleton />}>
        <Contacts contacts={resultContacts} />
      </Suspense>
    </>
  );
}
