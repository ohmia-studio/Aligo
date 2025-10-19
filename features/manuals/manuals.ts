export async function listManuals() {
  try {
    const res = await fetch('/api/manuales', { cache: 'no-store' });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json?.error || 'Error al obtener manuales',
        manuals: [],
      };
    }
    return { success: true, manuals: json.manuals ?? [] };
  } catch (err) {
    console.error('listManuals error:', err);
    return {
      success: false,
      error: 'Error de red al obtener manuales',
      manuals: [],
    };
  }
}
