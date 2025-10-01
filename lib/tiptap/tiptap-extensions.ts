// lib/tiptap-extensions.ts
import { HorizontalRule } from '@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import { ImageUploadNode } from '@/components/tiptap/tiptap-node/image-upload-node/image-upload-node-extension';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';


export const TIPTAP_EXTENSIONS = [
    StarterKit,
    HorizontalRule,
    TextAlign,
    TaskList,
    TaskItem,
    Highlight,
    Image,
    Typography,
    Selection,
    ImageUploadNode,
];
