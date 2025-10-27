'use client';

'use client';

import { useRouter } from 'next/navigation';

export default function AddContactToggle() {
  const router = useRouter();
  return (
    <button
      className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 px-5 py-2 font-semibold text-black shadow-md transition hover:from-yellow-600 hover:to-yellow-500"
      onClick={() => router.push('/dashboard/admin/contactos/agregar-contacto')}
    >
      + Agregar contacto
    </button>
  );
}
