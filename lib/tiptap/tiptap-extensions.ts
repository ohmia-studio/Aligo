// lib/tiptap-extensions.ts
import { ImageUploadNode } from '@/components/tiptap/tiptap-node/image-upload-node/image-upload-node-extension';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';
import { toast } from 'sonner';



interface TiptapExtensionOptions {
    onAddImage?: (params: { image: File; src: string }) => void;
    handleImageUpload?: (
        file: File,
        onProgress?: (event: { progress: number }) => void,
        signal?: AbortSignal
    ) => Promise<string>;
    MAX_FILE_SIZE?: number;
}

// Extensiones usadas para tiptap y configuraciones. En este caso para implementar la carga de la imagen y la animación, se necesitan pasar por parametro las funcionalidades implementadas por el editor.
export function tiptapExtensions({
    onAddImage,
    handleImageUpload,
    MAX_FILE_SIZE = 5 * 1024 * 1024, // default 5 MB
}: TiptapExtensionOptions = {}) {
    return [
        StarterKit.configure({
            link: { openOnClick: true, enableClickSelection: true },
            heading: {
                levels: [3, 4],
            }
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Image.configure({ HTMLAttributes: { class: 'editor-image' } }),
        Typography,
        Selection,
        ImageUploadNode.configure({
            accept: 'image/*',
            maxSize: MAX_FILE_SIZE,
            limit: 3,
            upload: async (file: File, onProgress = () => { }, signal) => {
                const tempSrc = await handleImageUpload?.(file, (event) => onProgress(event), signal);
                if (tempSrc && onAddImage) onAddImage({ image: file, src: tempSrc });
                return tempSrc ?? '';
            },
            onError: (error) => toast.error(error.message),
        }),
    ];
}
