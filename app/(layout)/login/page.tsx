'use client';
import AuthForm from '@/components/auth/AuthForm';

export default function Page() {
  //bg-gradient-to-br from-indigo-100 via-white to-blue-200
  // border-gray-100 bg-white/90
  return (
    <div className="background-gradient text-base-color flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-2 flex w-full items-center justify-center gap-2">
        <svg
          width="21"
          height="21"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#074D82" />
          <text
            x="16"
            y="22"
            textAnchor="middle"
            fontSize="16"
            fill="white"
            fontWeight="bold"
          >
            A
          </text>
        </svg>
        <span className="text-sm font-semibold tracking-wider">Aligo</span>
      </div>
      <div className="bg-card text-base-color mb-6 flex w-full max-w-md flex-col rounded-2xl border p-8 shadow-2xl">
        <section className="mb-6 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold">Inicio de sesión</h2>
          <p className="mt-1 text-sm">
            Accede a tu cuenta para gestionar la distribuidora
          </p>
        </section>
        <AuthForm />
      </div>
    </div>
  );
}
