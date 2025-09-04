# 🚀 Proyecto de Sistema Web - Aligo Distribuidora

Este proyecto corresponde al desarrollo de un **sistema web interno** para empleados y gerentes de un negocio, con funcionalidades de gestión, comunicación interna y administración de contenido.  
Además, incluye una **landing page pública** que sirve como punto de entrada para clientes y usuarios externos.

---

## 🤖 Tecnologías principales

- **Frontend & Backend**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/)
- **Estado global**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Base de datos y autenticación**: [Supabase](https://supabase.com/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting & Formateo**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

---

## ⚙️ Configuraciones clave

- **Eslint + Prettier**:  
  El proyecto está configurado con ESLint y Prettier para mantener un estilo de código consistente y evitar errores comunes.  
  → Ver archivo: `eslint.config.mjs`
  → Ejecutar comando: **npm run lint**

- **TypeScript**:  
  Estricto en el tipado. No se permite ignorar errores de compilación en producción.  
  → Ver archivo: `tsconfig.json`

- **TailwindCSS**:  
  Integrado con PostCSS. Todos los estilos globales se encuentran en `styles/globals.css`.  
  → Ver archivo: `tailwind.config.js`

- **Testing (TDD)**:  
  El flujo de trabajo sigue **Test Driven Development**. Antes de implementar nuevas funcionalidades, deben crearse pruebas unitarias.  
  → Ver carpeta: `tests/`
  → Ejecutar comando: **npm run test**

---

## 📁 Estructura de carpetas

- `app/`
  - Páginas y rutas (Next.js App Router)
  - `app/api/` → Rutas API (Server Actions / CRUD)
  - `(auth)/` → Login, registro y rutas de autenticación
  - `dashboard/` → Panel de administración y vistas internas

- `components/`
  - `ui/` → Componentes atómicos (botones, inputs, modals)
  - `common/` → Layout compartido (navbar, sidebar, footer)
  - `forms/` → Formularios reutilizables

- `features/`
  - Lógica de negocio y Redux slices
  - Servicios de API y funciones de dominio
  - Tipados e interfaces del módulo

- `lib/`
  - Helpers y utilidades compartidas (`auth.ts`, `supabaseClient.ts`)
  - Funciones genéricas independientes del dominio

- `packages/` _(opcional)_
  - Librerías internas o módulos compartidos (UI, utils)

- `tests/`
  - Pruebas unitarias e integradas
  - Refleja la misma jerarquía que `components/` y `features/`

- Archivos de configuración en la raíz:
  - ESLint, Prettier, Tailwind, TypeScript, Jest, PostCSS
  - `.vscode/settings.json` → Opcional para configuración compartida del editor

## 📌 Flujo de trabajo recomendado

1. Crear un **branch** por feature o bugfix.
2. Escribir primero los **tests** (TDD).
3. Implementar la funcionalidad.
4. Ejecutar:
   ```bash
   npm run lint     # Corre ESLint
   npm run test     # Corre Jest
   npm run dev      # Levanta el servidor en local
   ```
5. Realizar PR (Pull Request) y code review.

## 🎯 Objetivos del proyecto

Facilitar la gestión de empleados y clientes (roles y permisos).

Centralizar noticias, manuales, catálogos y productos en un sistema accesible vía web.

Proveer un dashboard interno seguro y moderno.

Incluir una landing page pública para acceso al sistema y presentación de la empresa.

## 👩‍💻 Dev config

Setup Next.js custom typescript auto-completion and type-checking:
You can enable the plugin in VS Code by:

    1. Opening the command palette (Ctrl/⌘ + Shift + P)
    2. Searching for "TypeScript: Select TypeScript Version"
    3. Selecting "Use Workspace Version"
