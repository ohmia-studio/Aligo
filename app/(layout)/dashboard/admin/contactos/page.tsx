import { ContactListSkeleton } from '@/components/contactos/ContactListSkeleton';
import Contacts from '@/components/contactos/contacts';
import { listContactsAction } from '@/features/contactos/listContacts';

import { Suspense } from 'react';

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
