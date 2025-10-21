// utilidad: extraer srcs desde JSON de TipTap
export function extractImageSrcsFromJSON(json: any): string[] {
    const imagesSrcs: string[] = [];
    if (!json) return imagesSrcs;

    const lookForImagesNodes = (node: any) => {
        if (!node) return;

        // Si un node es un array, recorre cada nodo contenido en el mismo en busqueda de imgs (recursividad)
        if (Array.isArray(node)) {
            node.forEach(lookForImagesNodes);
            return;
        }
        if (node.type === 'image' && node.attrs?.src) {
            imagesSrcs.push(node.attrs.src);
        }
        // Si el nodo tiene contenido, recorre el mismo para buscar imagenes (recursividad)
        if (node.content) node.content.forEach(lookForImagesNodes);
    };

    lookForImagesNodes(json);
    return imagesSrcs;
};

// Reemplaza srcs temporales por URLs definitivas (mapping: temp->public)
export function replaceImageSrcsInJSON(node: any, mapping: Record<string, string>): any {
    if (!node || typeof node !== 'object') return node;

    // ✅ Evitar perder propiedades internas
    const copy: any = Array.isArray(node) ? [] : { ...node };

    if (node.type === 'image' && node.attrs) {
        const newSrc = mapping[node.attrs.src];
        copy.attrs = {
            ...node.attrs,
            src: newSrc ?? node.attrs.src, // mantener todos los demás attrs intactos
        };
    }

    if (node.content) {
        copy.content = node.content.map((c: any) => replaceImageSrcsInJSON(c, mapping));
    } else if (Array.isArray(node)) {
        return node.map((c: any) => replaceImageSrcsInJSON(c, mapping));
    }

    return copy;
}
