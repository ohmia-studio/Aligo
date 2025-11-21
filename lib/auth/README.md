# Autenticación y autorizaciones (helpers / "decoradores")

Este documento explica los helpers (HOF / "decoradores") que viven en `lib/auth` y cómo usarlos en tus route handlers (App Router), en Server Actions y en `pages/api`.

Archivos importantes

- `lib/auth/requireServerAuth.ts`
  - Verifica la sesión de Supabase en el servidor usando `getSupabaseServer()` y opcionalmente valida roles contra la tabla de usuarios (a través de `getUserByEmail`).
  - Firma: `requireServerAuth({ allowedRoles?: string[] | string })` → devuelve `{ ok: true, user, appUser? }` o `{ ok: false, response }` (donde `response` es un `NextResponse.json(...)`).
  - Debe ejecutarse en el servidor. No importarlo ni ejecutarlo desde componentes marcados con `use client`.

- `lib/auth/withAuth.ts`
  - HOF para envolver route handlers del App Router. Recibe el handler y una opción `roles` (string | string[]).
  - Uso: `export const GET = withAuth(async (req, auth) => { ... }, { roles: ['admin','empleado'] })`.
  - Normaliza roles y invoca `requireServerAuth` antes de ejecutar el handler. Si la verificación falla, retorna la `NextResponse` correspondiente (401/403).

Por qué existen estos helpers

- Middleware vs helpers por endpoint
  - El `middleware.ts` que ya tienes es ideal para protección a nivel de navegación (UX): redirige usuarios no autenticados antes de que se renderice una página.
  - Sin embargo, las APIs deben validar en el servidor por cada petición (defensa en profundidad). Por eso `withAuth`/`requireServerAuth` validan dentro de los handlers.
  - Recomendación combinada: usa middleware para bloquear rutas UI y `requireServerAuth`/`withAuth` para proteger endpoints y Server Actions.

Cómo usar los helpers

1. Proteger endpoints App Router (`app/api/.../route.ts`)

```ts
// app/api/mi-endpoint/route.ts
import { withAuth } from '@/lib/auth/withAuth';

export const GET = withAuth(
  async (req, auth) => {
    // auth.user y auth.appUser estan disponibles
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  },
  { roles: ['admin', 'empleado'] }
);
```

2. Proteger Server Actions

- Opción directa (llamar al helper dentro de la action):

```ts
import { requireServerAuth } from '@/lib/auth/requireServerAuth';

export async function uploadCatalogAction(formData: FormData) {
  const auth = await requireServerAuth({ allowedRoles: 'admin' });
  if (!auth.ok) return { success: false, error: 'Unauthorized' };

  // continuar con la lógica, auth.appUser disponible
}
```

- Opción DRY: `withAuthAction` (recomendado si tienes muchas actions similares). Puedes crear un HOF que envuelva tus actions y pase `auth` como último argumento.

3. Roles ("1 u otro")

- Para aceptar varios roles pásalos como array: `{ roles: ['admin','empleado'] }`. El chequeo hace `roles.includes(appUser.rol)`, por lo que se autoriza cuando el rol del usuario es cualquiera de los listados.

Buenas prácticas y notas

- Server-only: estos helpers están diseñados para ejecutarse en el servidor. Evita importarlos en componentes client-side (marcados con `use client`) para prevenir bundling de código server-only en el cliente.
- Runtime: tus route handlers pueden declarar `export const runtime = 'nodejs'` si dependen de APIs Node (R2, AWS SDK). Eso asegura el entorno server adecuado.
- Guard en desarrollo: si quieres evitar importaciones accidentales desde cliente, añade una comprobación en `requireServerAuth` que lance si `typeof window !== 'undefined'`.
- Errores y respuestas: `requireServerAuth` devuelve `NextResponse.json` cuando la verificación falla (401/403). `withAuth` reenvía esa respuesta al cliente directamente.
- Middleware: proteger `/api/*` desde `middleware.ts` es posible, pero ten en cuenta que middleware corre en un runtime distinto (Edge) y algunas llamadas a SDK o DB pueden no ser adecuadas allí. Por eso se recomienda validar dentro de cada handler.

Testing rápido

- Sin sesión (borrar cookies): peticiones a endpoints protegidos deben devolver 401.
- Con sesión pero rol incorrecto: 403.
- Con sesión y rol correcto: 200 / el recurso esperado.
