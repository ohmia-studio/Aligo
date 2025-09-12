# 📝 Registro de errores y soluciones

> Este archivo sirve como guía para documentar errores encontrados durante el desarrollo, su causa, la solución aplicada y notas adicionales.  
> Mantenerlo actualizado ayuda al equipo a aprender de problemas pasados y agilizar la resolución de futuros bugs.

---

## 🔹 Cómo registrar un error

Cada error debe documentarse siguiendo la siguiente estructura:

### 1️⃣ ID o Fecha

- Ejemplo: `#001 – 2025-09-11`
- Permite ordenar los errores cronológicamente o por número de incidencia.

### 2️⃣ Descripción del error

- Breve descripción del error o comportamiento inesperado.
- Incluir el mensaje de consola o el síntoma principal.

### 3️⃣ Contexto

- Archivo, componente o módulo donde ocurrió.
- Frameworks, librerías y versión involucradas.
- Qué estabas intentando hacer cuando apareció el error.

### 4️⃣ Causa

- Explicación de por qué ocurrió el error.
- Puede incluir detalles técnicos, malas prácticas o configuraciones incorrectas.

### 5️⃣ Solución aplicada

- Código corregido o cambios realizados.
- Dependencias instaladas o configuraciones modificadas.
- Buenas prácticas aprendidas o recomendaciones futuras.

### 6️⃣ Referencias / Enlaces (opcional)

- Documentación oficial.
- Issues de GitHub, StackOverflow, blogs o artículos.
- Links internos del proyecto si aplica.

### 7️⃣ Notas adicionales

- Tips para evitar este error en el futuro.
- Lecciones aprendidas.
- Información adicional que pueda ayudar a otros desarrolladores.

---

## Ejemplo

# 001 – 2025-09-11

**Error:** TypeScript dice que `process` no está definido al crear `supabaseClient`.

**Contexto:**

- Archivo: `lib/supabaseClient.ts`
- Proyecto: Next.js 15 + TypeScript + Supabase
- Intentaba usar `process.env.SUPABASE_KEY`

**Causa:**

- TypeScript no conoce el namespace `NodeJS`.
- Faltaba tipar las variables de entorno en `next.env.d.ts`.

**Solución aplicada:**

- Crear archivo `next.env.d.ts` con las variables tipadas.
- Agregar `"types": ["node"]` en `tsconfig.json`.

**Referencias / enlaces:**

- https://nextjs.org/docs/basic-features/environment-variables
- https://www.typescriptlang.org/docs/handbook/declaration-merging.html

**Notas adicionales:**

- Siempre tipar variables de entorno evita errores de compilación en Next.js + TypeScript.

---

# 002 – 2025-09-11

**Error:** TypeScript y ESLint no reconocían los globals de Jest (`describe`, `it`, `expect`) en los archivos de test.

**Contexto:**

- Archivos afectados: `tests/**/*.ts` y `tests/**/*.tsx`
- Proyecto: Next.js 15 + TypeScript + Jest + Testing Library
- Intentaba hacer TDD y VS Code mostraba errores “describe is not defined”, “it is not defined”, “expect is not defined”.

**Causa:**

- TypeScript no sabía que los archivos de test usan Jest.
- ESLint también marcaba errores porque el parser de TS no conoce los globals de Jest por defecto.
- Los tests no estaban tipados correctamente y no había override en ESLint para Jest.

**Solución aplicada:**

1. **TypeScript:**
   - Se agregó `"types": ["node", "jest", "express"]` en el `compilerOptions` de `tsconfig.json`.
   - Se incluyó `"tests/**/*.ts"` en el array `include` del tsconfig para que TypeScript analice los tests.

2. **ESLint:**
   - Se agregó un **override** en `eslint.config.mjs` para los archivos de test:
   ```js
   {
     files: ['tests/**/*.ts', 'tests/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
     env: {
       jest: true, // activa globals de Jest
     },
   }
   ```

# 003 – 2025-09-11

### 2️⃣ Descripción del error

Los tests escritos con Jest en TypeScript no se ejecutaban correctamente.  
Al correr `npm run test`, Jest no encontraba los archivos o lanzaba errores de transformación de TypeScript y de importaciones con alias (`@/`).

### 3️⃣ Contexto

- **Archivo / módulo**: `tests/features/auth/loginUser.test.ts`
- **Frameworks / librerías**: Next.js 14, TypeScript 5.x, Jest 29.x, ts-jest, React Testing Library
- **Intento**: correr tests unitarios de lógica backend (`loginUser`) y frontend (componentes React)

### 4️⃣ Causa

- Configuración de Jest incompleta para TypeScript y Next.js.
- No se habían definido correctamente los `transform` para `.ts`/`.tsx`.
- No se configuró `moduleNameMapper` para que Jest resolviera los imports con alias `@/`.
- El entorno (`testEnvironment`) estaba mal definido para los tipos de test que se ejecutaban (backend y frontend).

### 5️⃣ Solución aplicada

1. Configuración de jest.config.js unificada:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // compatible con frontend y backend
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
```

# #004 – 2025-09-11

### 2️⃣ Descripción del error

- Los tests con Jest no podían acceder a las **variables de entorno** definidas en `.env.local`.
- Esto causaba errores de tipo `undefined` al intentar usar `process.env.NEXT_PUBLIC_SUPABASE_URL` y otras variables dentro de los tests.

### 3️⃣ Contexto

- Archivos afectados: tests unitarios de login (`loginUser.test.ts`) y cualquier test que use el cliente de Supabase.
- Frameworks / librerías: Next.js 13+, Jest, TypeScript, Supabase JS.
- Intento: correr tests que dependían de variables de entorno sin que estas estuvieran cargadas automáticamente.

### 4️⃣ Causa

- Jest **no carga automáticamente las variables de entorno** definidas en `.env.local`.
- Por lo tanto, cualquier función que dependiera de estas variables fallaba en los tests.
- Esto ocurre porque Jest corre en un entorno Node aislado y no lee los archivos `.env` de Next.js por defecto.

### 5️⃣ Solución aplicada

- Se creó un archivo de configuración para Jest que carga las variables de entorno antes de ejecutar los tests:

**`jest.setup.js`**

```js
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
```

- Se agregó la siguiente configuración a jest.config.js:

```js
setupFiles: ['<rootDir>/jest.setup.js'], // carga variables de entorno antes de los tests
```

# #005 – 2025-09-12

### 1️⃣ Descripción del error

Necesitaba testear funciones de servidor que utilizan Supabase en un proyecto con **Next.js**, **Jest** y **Testing Library**, pero mi implementación era engorrosa:

- Tenía **dos clientes de Supabase** (uno para server y otro para client).
- En cada función debía pasar manualmente un `supabaseProvider` (que podía ser función o instancia).
- Esto hacía que el código fuera repetitivo, difícil de mantener y poco limpio.

### 2️⃣ Contexto

- **Archivo(s):** `/lib/supabaseServer.ts`, `/lib/supabaseClient.ts`, funciones como `loginUser.ts`.
- **Framework/Librerías:**
  - Next.js 15.5.2
  - @supabase/supabase-js 2.57.4
  - Jest 30.1.3
- **Situación:** Quería testear las funciones de servidor sin tener que pasar el cliente en cada test y sin usar `@supabase/ssr`.

### 3️⃣ Causa

Diseño inicial incorrecto:

- Separar cliente y server en dos archivos estaba bien, pero **la necesidad de pasar el cliente manualmente en cada función era innecesaria**.
- No estaba aprovechando un **singleton** para el cliente de Supabase.
- Agregaba complejidad a la API de mis funciones (las hacía menos amigables y más verbosas).

### 4️⃣ Solución aplicada

1. **Unifiqué la creación del cliente en un único módulo `/lib/supabase.ts`:**

```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}
```

2. Modifiqué las funciones de negocio para que usen getSupabase() directamente

```ts
import { getSupabase } from './supabase';

export async function loginUser({ email, password }: LoginParams) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { status: 401, message: 'Credenciales incorrectas' };
  return { status: 200, message: 'Login exitoso', user: data.user };
}
```

### Referencias

- Supabase Docs – createClient

- StackOverflow – Supabase singleton pattern
