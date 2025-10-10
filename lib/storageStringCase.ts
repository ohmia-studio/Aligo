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