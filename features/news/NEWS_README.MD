# 📰 Módulo de Novedades

Este documento explica la estructura, el flujo de datos y la interacción entre los componentes del **módulo de novedades**, que permite crear, editar, mostrar y eliminar noticias dentro del panel administrativo.

---

## 📁 Ruta del módulo

- /dashboard/news

---

## ⚙️ Comunicación backend

### Archivos principales:

- **`news.ts`** → Gestiona la comunicación con el esquema `news` en la base de datos y con el bucket de almacenamiento (`storage`) en Supabase.
- **`tags.ts`** → Gestiona la tabla de **tags**, utilizada para la categorización de las novedades.

> Ambos scripts trabajan en conjunto para que las novedades puedan tener etiquetas, imágenes y contenido enriquecido.

---

## 🧭 Flujo de componentes frontend

El flujo general de renderizado y comunicación se organiza de la siguiente forma:

### 1. `dashboard/news/page.tsx` _(Server Component)_

- Es el **punto de entrada principal** del módulo.
- Solicita la información de las novedades existentes y sus características desde los scripts:
  - `news.ts`
  - `tags.ts`
- Envía la información obtenida al componente `news.tsx`, que se encarga de mostrar y gestionar las novedades.
- `page.tsx` ──▶ `news.tsx` ──▶ `NewsList.tsx` / `newsForm.tsx`

---

### 2. `news.tsx` _(Client Component)_

Este componente actúa como **controlador dinámico** del módulo de novedades.

#### Funciones principales:

- Renderiza el listado de novedades existentes.
- Gestiona la animación y la interacción de los distintos elementos.
- Determina cuándo mostrar el formulario de creación o edición.

#### Subcomponentes:

- **`NewsList.tsx`**
  - Recibe los datos de cada novedad desde `news.tsx`.
  - Renderiza cada elemento y convierte el formato `docs` (estructura de TipTap) en contenido visual.
  - Permite las acciones **Editar** y **Borrar** sobre cada novedad.

- **`newsForm.tsx`**
  - Se utiliza tanto para **crear** como para **editar** una novedad.
  - Si se está creando una nueva novedad, se asigna el identificador:
    ```ts
    id = -1;
    ```
  - Recibe también la lista de `tags` desde `tags.ts`.

---

### 3. `newsForm.tsx` _(Client Component principal)_

Es el **núcleo del sistema de novedades**.

#### Responsabilidades:

- Mantiene el **estado completo** de una novedad en edición o creación.
- Se comunica con el **editor de texto enriquecido TipTap**, configurado en `tiptap-editor.tsx`.
- Gestiona la subida, actualización y eliminación de imágenes vinculadas al contenido.

#### Interacción con el editor TipTap:

- Se comunican mediante funciones callback:
  - `onChange` → actualiza el estado local de la novedad.
  - `onAddImage` → gestiona la subida de una nueva imagen al bucket.
  - `onRemoveImage` → elimina una imagen del bucket y actualiza su referencia en el contenido.
- Cada nodo del editor (texto, imagen, encabezado, etc.) mantiene coherencia entre su estado y el formato `JSON` de TipTap.

#### Server Actions:

`newsForm.tsx` invoca dos acciones del servidor:

- `createNews()` → Crea una nueva novedad en la base de datos.
- `updateNews()` → Actualiza una novedad existente.

#### Manejo de imágenes:

Las imágenes se gestionan mediante funciones importadas de `news.ts`:

- `uploadNewImage()` → Sube una nueva imagen al bucket `Novedades`.
- `moveExistingImage()` → Mueve imágenes cuando se modifica el título o la ruta de la novedad.

##### 📌 Convención de nombres:

- Los archivos subidos al bucket siguen una convención **snake-case + timestamp ISO**, garantizando nombres únicos.
- ejemplo: titulo-novedad-2025-10-13T12-30-04Z.png

#### Actualización de URLs:

Para mantener las rutas correctas de las imágenes al modificar títulos o rutas, se utilizan funciones del archivo `tiptap-images-src.ts`:

- `extractImageSrcsFromJSON()`
- `replaceImageSrcsInJSON()`

Estas funciones permiten analizar y actualizar los atributos `src` de cada nodo `image` dentro del contenido TipTap.

---

## 🧩 Librerías y componentes utilizados

### 🧱 **shadcn/ui**

Componentes prearmados para una interfaz moderna y consistente:

- `Sonner` / `Toast` → Notificaciones rápidas.
- `Button` → Botones estilizados.
- `AlertDialog` → Confirmaciones de acciones críticas.
- `Tooltip` → Ayuda contextual.

### 🎞 **motion (framer-motion)**

Utilizado para animar la aparición y transición de componentes en pantalla, mejorando la experiencia del usuario.

---

## 🧠 Resumen conceptual del flujo

```text
(page.tsx) ── obtiene datos del backend
 │
 ▼
(news.tsx) ── renderiza lista y controla interacción
 ├── NewsList.tsx → muestra novedades
 └── newsForm.tsx → crea / edita novedades
         │
         ▼
 (tiptap-editor.tsx) ── editor de texto enriquecido
         │
         ▼
 (Supabase storage + base de datos)
```

---

## Problemática de los atributos del nodo Heading

- Next.js (y en general Web APIs) usan el algoritmo de structured clone cuando pasan objetos entre capas (o internamente Next hace serializaciones).
- JSON.stringify elimina propiedades cuyo valor sea undefined. También clases con getters/setters poco comunes, funciones, símbolos, etc.
- Si tus nodos contienen attrs pero en algún momento alguna propiedad quedó undefined (por ejemplo width: undefined) la propiedad entera puede desaparecer al serializar, o la estructura puede transformarse.
- Resultado: cliente muestra attrs antes de invocar el Server Action (porque en la memoria del navegador todavía estaban), pero lo que llega al server es una versión ya “limpia” (sin keys undefined) o incluso con attrs ausentes en algunos nodos.

### SOLUCION

1. Normalizar el JSON de TipTap en el cliente para garantizar que todos los nodos tengan attrs explícitos (no undefined) y que los heading contengan level si correspondiera, etc.
2. Serializar explícitamente (hacer JSON.stringify) y enviar una cadena a la Server Action. En el servidor JSON.parse y validar/usar el objeto parsed. Esto elimina cualquier ambigüedad del paso de parámetros y de la clonación estructurada.

## 🪄 Notas finales

- El formato `docs` almacenado en la base de datos es la estructura serializada del contenido TipTap.
- Cada cambio visual o estructural en el editor se refleja directamente en el JSON final.
- El sistema garantiza compatibilidad al editar novedades preexistentes, preservando el formato y las rutas multimedia.
- Los nombres únicos y los métodos de reemplazo aseguran integridad entre las URLs del contenido y los archivos en el bucket.

### ✍️ Autor: Ohmia

### 🗓 Última actualización: Octubre 2025

### 📦 Tecnologías principales: Nextjs15, React, TypeScript, TipTap, Supabase, shadcn/ui, motion
