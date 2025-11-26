'use client';

export function triggerDownload(key: string, name?: string, view = false) {
  const encodedKey = encodeURIComponent(key);
  const encodedName = encodeURIComponent(
    name || key.split('/').pop() || 'archivo.pdf'
  );
  const url = `/api/storage?key=${encodedKey}&name=${encodedName}${view ? '&view=true' : ''}`;
  window.location.href = url;
}
