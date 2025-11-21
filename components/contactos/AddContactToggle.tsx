'use client';

'use client';

import { useRouter } from 'next/navigation';

export default function AddContactToggle() {
  const router = useRouter();
  return (
    <button
      className="from-primary to-primary/90 hover:bg-primary hover:border-accent-foreground text-base-color-foreground rounded-full bg-gradient-to-r px-5 py-2 font-semibold shadow-md transition duration-150 hover:scale-105 hover:cursor-pointer hover:border-2"
      onClick={() => router.push('/dashboard/admin/contactos/agregar-contacto')}
    >
      + Agregar contacto
    </button>
  );
}
