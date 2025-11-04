// Guardado de la novedad en el bucket storage con formato snake-case
// El replace(/\s/g, '-') cambia los espacios en el nombre por -
export function newsStorageFolderSnakeCase(title: string, uploadTime: Date) {
    // Casting (conversión) ya que la fecha recibida de la BD en formato Date, en el cliente se transforma en String.
    // Hay que reconvertirla a Date para poder acceder a sus metodos.
    const dateCast = new Date(uploadTime);
    return title.trim().replace(/\s/g, '-').concat('-' + dateCast.getTime().toString());
}

// Aca además reemplaza los . por -
export function newsStorageFileSnakeCase(title: string) {
    return title.trim().replace(/[ .\s]/g, '-');
}

/**
 * Convierte un nombre arbitrario (con acentos, espacios, caracteres especiales) en un nombre seguro para rutas.
 * Ej: "Utilización de acentos y ñ" => "utilizacion-de-acentos-y-n"
 * Y para archivos con extensión: preserve la extensión.
 */
export function sanitizeForStorage(name: string): string {
    if (!name) return '';

    // Separar nombre + extensión si la hay
    let base = name;
    let extension = '';
    const last = name.lastIndexOf('-'); // Busca el último '-' para la extensión (porque está en snake-case)
    if (last !== -1 && last !== 0 && last !== name.length - 1) {
        base = name.substring(0, last);
        extension = name.substring(last + 1);
    }

    // Normalizar acentos / diacríticos (usa Unicode Normalization + regex)
    base = base.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quitar diacríticos
        .toLowerCase();

    // Reemplazar caracteres no alfanuméricos por guion
    base = base.replace(/[^a-z0-9]+/g, '-');

    // Quitar guiones al inicio / fin dobles
    base = base.replace(/^-+|-+$/g, '');

    let safe = base;
    if (extension) {
        // sanear la extensión también (solo caracteres alfanuméricos)
        const safeExt = extension.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (safeExt) {
            safe = `${safe}-${safeExt}`;
        }
    }
    return safe;
}