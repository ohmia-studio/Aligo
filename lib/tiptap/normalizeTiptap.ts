// lib/tiptap/normalizeTipTap.ts
/**
 * Helper que recorre el documento TipTap y garantiza los attrs esperados.
 * @param json Documento TipTap en formato JSON
 * @returns HTML generado
 */
export function normalizeTipTapJSON(node: any): any {
  if (node === null || node === undefined) return node;

  // Si es array -> map
  if (Array.isArray(node)) {
    return node.map((n) => normalizeTipTapJSON(n));
  }

  // Si no es objeto -> devuélvelo
  if (typeof node !== 'object') return node;

  // Copia superficial (para no mutar original)
  const copy: any = { ...node };

  // Aseguramos attrs en nodos que lo necesitan
  if (copy.type === 'image') {
    copy.attrs = {
      src: copy.attrs?.src ?? null,
      alt: copy.attrs?.alt ?? null,
      title: copy.attrs?.title ?? null,
      width: copy.attrs?.width ?? null,
      height: copy.attrs?.height ?? null,
      // Mantener otras keys si existen
      ...((copy.attrs && typeof copy.attrs === 'object') ? Object.fromEntries(Object.entries(copy.attrs).filter(([k]) => !['src', 'alt', 'title', 'width', 'height'].includes(k))) : {}),
    };
  }

  if (copy.type === 'heading') {
    // Tiptap heading suele usar attrs.level (o depende de tu extensión).
    copy.attrs = {
      ...copy.attrs,
      level: copy.attrs?.level ?? copy.level ?? 3, // fallback 3 si no hay
    };
  }

  // Si existe content, normalizar recursivamente
  if (copy.content) {
    copy.content = copy.content.map((c: any) => normalizeTipTapJSON(c));
  }

  return copy;
}

// También un helper para normalizar todo el documento:
export function normalizeTipTapDocument(doc: any) {
  if (!doc) return doc;
  return normalizeTipTapJSON(doc);
}
