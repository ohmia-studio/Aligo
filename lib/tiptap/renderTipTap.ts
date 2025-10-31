// lib/renderTipTap.ts
import { generateHTML } from '@tiptap/html';
import { tiptapExtensions } from './tiptap-extensions';

/**
 * Convierte un documento TipTap JSON en HTML
 * @param json Documento TipTap en formato JSON
 * @returns HTML generado
 */
export function renderTiptapJSON(json: any): string {
    // Usamos createTiptapExtensions sin onAddImage ni handleImageUpload
    const extensions = tiptapExtensions();

    return generateHTML(json, extensions);
}
