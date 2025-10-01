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

    const copy = Array.isArray(node) ? [...node] : { ...node };

    if (
        !Array.isArray(node) &&
        node.attrs &&
        node.attrs.src &&
        mapping[node.attrs.src]
    ) {
        copy.attrs = { ...node.attrs, src: mapping[node.attrs.src] };
    }
    if (node.content) {
        copy.content = node.content.map((c: any) =>
            replaceImageSrcsInJSON(c, mapping)
        );
    }
    if (Array.isArray(node)) {
        return copy.map((c: any) => replaceImageSrcsInJSON(c, mapping));
    }
    return copy;
};