'use client';

import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import * as React from 'react';

// --- Tiptap Core Extensions ---
import { TIPTAP_EXTENSIONS } from '@/lib/tiptap/tiptap-extensions';

// --- UI Primitives ---
import { Button } from '@/components/tiptap/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap/tiptap-ui-primitive/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/tiptap/tiptap-ui-primitive/toolbar';

// --- Tiptap Node ---
import '@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap/tiptap-node/heading-node/heading-node.scss';
import '@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/components/tiptap/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss';

// --- Tiptap UI ---
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

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap/tiptap-icons/link-icon';

// --- Hooks ---
import { useCursorVisibility } from '@/hooks/tiptap/use-cursor-visibility';
import { useIsMobile } from '@/hooks/tiptap/use-mobile';
import { useWindowSize } from '@/hooks/tiptap/use-window-size';

// --- Components ---
import { ThemeToggle } from '@/components/tiptap/tiptap-templates/theme-toggle';

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap/tiptap-utils';

// --- Styles ---
import '@/components/tiptap/tiptap-templates/tiptap-editor.scss';

import { toast } from 'sonner';

import { EditorImage } from '@/interfaces/editor-interfaces';

interface DescriptionParams {
  content?: any;
  onChange?: (json: any) => void;
  onAddImage?: (img: EditorImage) => void;
  onRemoveImage?: (src: string) => void;
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
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

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
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
);

export function TextEditor({
  content,
  onChange,
  onAddImage,
}: DescriptionParams) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    'main' | 'highlighter' | 'link'
  >('main');
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'simple-editor',
      },
    },
    extensions: [
      TIPTAP_EXTENSIONS[0].configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TIPTAP_EXTENSIONS[1],
      TIPTAP_EXTENSIONS[2].configure({ types: ['heading', 'paragraph'] }),
      TIPTAP_EXTENSIONS[3],
      TIPTAP_EXTENSIONS[4].configure({ nested: true }),
      TIPTAP_EXTENSIONS[5].configure({ multicolor: true }),
      TIPTAP_EXTENSIONS[6].configure({
        HTMLAttributes: { class: 'editor-image' },
      }),
      TIPTAP_EXTENSIONS[7],
      TIPTAP_EXTENSIONS[8],
      TIPTAP_EXTENSIONS[9].configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: async (file: File, onProgess, signal) => {
          // Devuelve URL de preview (no sube)
          const tempSrc = await handleImageUpload(file, onProgess, signal);
          onAddImage?.({ image: file, src: tempSrc });
          // Retornamos la URL para que TipTap la inserte en el doc
          return tempSrc;
        },
        onError: (error) => toast.error(error.message),
      }),
    ],
    content: content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    },
  });

  // Si el valor cambia desde afuera (NewsForm cambia `description` manualmente)
  React.useEffect(() => {
    if (editor && content) {
      const current = editor.getJSON();
      // Solo actualizar si el contenido externo es distinto (evitar bucles infinitos)
      if (JSON.stringify(current) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  return (
    <div className="h-5/6 w-auto overflow-auto">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === 'main' ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
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
