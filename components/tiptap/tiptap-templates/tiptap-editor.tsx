'use client';

import { ArrowLeftIcon } from '@/components/tiptap/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap/tiptap-icons/link-icon';
import { Button } from '@/components/tiptap/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap/tiptap-ui-primitive/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/tiptap/tiptap-ui-primitive/toolbar';
import { BlockquoteButton } from '@/components/tiptap/tiptap-ui/blockquote-button';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from '@/components/tiptap/tiptap-ui/color-highlight-popover';
import { HeadingDropdownMenu } from '@/components/tiptap/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/components/tiptap/tiptap-ui/image-upload-button';
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from '@/components/tiptap/tiptap-ui/link-popover';
import { ListDropdownMenu } from '@/components/tiptap/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '@/components/tiptap/tiptap-ui/mark-button';
import { TextAlignButton } from '@/components/tiptap/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap/tiptap-ui/undo-redo-button';
import { useCursorVisibility } from '@/hooks/tiptap/use-cursor-visibility';
import { useIsMobile } from '@/hooks/tiptap/use-mobile';
import { useWindowSize } from '@/hooks/tiptap/use-window-size';
import { EditorImage } from '@/interfaces/editor-interfaces';
import { tiptapExtensions } from '@/lib/tiptap/tiptap-extensions';
import { extractImageSrcsFromJSON } from '@/lib/tiptap/tiptap-images-src';
import { handleImageUpload } from '@/lib/tiptap/tiptap-utils';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import * as React from 'react';

import '@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap/tiptap-node/heading-node/heading-node.scss';
import '@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/components/tiptap/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/tiptap/tiptap-templates/tiptap-editor.scss';

interface DescriptionParams {
  content?: any;
  onChange?: (json: any) => void;
  onAddImage?: (img: EditorImage) => void;
  onRemoveImage?: (src: string) => void;
}

/* ---------------- Toolbar Components ---------------- */
const MainToolbarContent = React.memo(
  ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
  }: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
  }) => (
    <div className="flex flex-wrap justify-center gap-2">
      {!isMobile && <Spacer />}
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={['bulletList', 'orderedList', 'taskList']}
          portal={isMobile}
        />
        <BlockquoteButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
      {!isMobile && <Spacer />}
      {isMobile && <ToolbarSeparator />}
    </div>
  )
);

const MobileToolbarContent = React.memo(
  ({ type, onBack }: { type: 'highlighter' | 'link'; onBack: () => void }) => (
    <>
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === 'highlighter' ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>
      <ToolbarSeparator />
      {type === 'highlighter' ? (
        <ColorHighlightPopoverContent />
      ) : (
        <LinkContent />
      )}
    </>
  )
);

/* ---------------- Editor Component ---------------- */
export function TextEditor({
  content,
  onChange,
  onAddImage,
  onRemoveImage,
}: DescriptionParams) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    'main' | 'highlighter' | 'link'
  >('main');
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  // Usamos ref para no provocar re-render cuando cambian las imágenes, algo que si ocurriría si usaramos un estado (useState)
  const prevImagesRef = React.useRef<string[]>(
    content ? extractImageSrcsFromJSON(content) : []
  );

  // Evitar recrear editor en cada render
  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'simple-editor',
        },
      },
      extensions: tiptapExtensions({
        onAddImage,
        handleImageUpload,
        MAX_FILE_SIZE: 1 * 1024 * 1024,
      }),
      content: content || { type: 'doc', content: [] },
      // Con el useCallback añade el react memo a la función o callback que se ejecuta.
      onUpdate: React.useCallback(
        ({ editor }: any) => {
          // Lógica liviana: solo detectar cambios de imágenes y contenido
          const json = editor.getJSON();

          // Solo ejecutar cada cierto tiempo o si cambió algo realmente
          const currentImages = extractImageSrcsFromJSON(json);
          const prevImages = prevImagesRef.current;

          if (prevImages.length) {
            const deleted = prevImages.filter(
              (src) => !currentImages.includes(src)
            );
            if (deleted.length) {
              deleted.forEach((src) => onRemoveImage?.(src));
            }
          }

          // Actualizamos referencia sin causar re-render
          prevImagesRef.current = currentImages;

          // Evitamos onChange en cada tecla: debounce 250ms
          if (onChange) {
            clearTimeout((onChange as any)._debounce);
            (onChange as any)._debounce = setTimeout(() => onChange(json), 250);
          }
        },
        [onChange, onRemoveImage]
      ),
    },
    []
  );

  // Sincronizamos contenido externo solo si realmente cambia
  React.useEffect(() => {
    if (editor && content) {
      const current = editor.getJSON();
      if (JSON.stringify(current) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
        prevImagesRef.current = extractImageSrcsFromJSON(content);
      }
    }
  }, [content, editor]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') setMobileView('main');
  }, [isMobile, mobileView]);

  return (
    <div className="h-[inherit] w-auto overflow-auto">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile
              ? {
                  position: 'relative',
                  display: 'flex',
                  flexFlow: 'column',
                }
              : undefined
          }
          className="justify-center"
        >
          {mobileView === 'main' ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView}
              onBack={() => setMobileView('main')}
            />
          )}
        </Toolbar>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
