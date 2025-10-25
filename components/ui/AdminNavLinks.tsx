// components/ui/AdminNavLinks.tsx
import Link from 'next/link';

export default function AdminNavLinks() {
  return (
    <>
      <Link
        href="/dashboard/admin/contactos"
        className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 font-medium text-green-700 transition hover:bg-green-200"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Contactos
      </Link>
      <Link
        href="/dashboard/admin/empleados"
        className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 font-medium text-green-700 transition hover:bg-green-200"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Empleados
      </Link>
    </>
  );
}
