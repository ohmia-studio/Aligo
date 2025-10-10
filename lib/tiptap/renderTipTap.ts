import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "./tiptap-extensions";

export function renderTiptapJSON(json: any): string {
    return generateHTML(json, TIPTAP_EXTENSIONS);
}
