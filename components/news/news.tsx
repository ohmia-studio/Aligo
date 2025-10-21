'use client';

import { NewEdit, TagItem } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import BubbleInfo from './bubbleInfo';
import NewsForm from './newsForm';
import NewsList from './newsList';
import NewsListSkeleton from './newsListSkeleton';

export default function News({
  news,
  tags,
}: {
  news: Result;
  tags: TagItem[];
}) {
  const defaultEdit: NewEdit = {
    id: -1,
    titulo: '',
    tag: null,
    bucket_folder_url: '',
    created_at: new Date(),
    descripcion: null,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [newEdit, setNewEdit] = useState<NewEdit>(defaultEdit);

  useEffect(() => {
    if (!isOpen && newEdit.id !== -1) setIsOpen(true);
    else if (isOpen && newEdit.id === -1) setIsOpen(false);
  }, [newEdit]);

  return (
    <div className="space-y-8 p-6">
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <h1>Novedades</h1>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            type="button"
            className="hover:border-accent-foreground relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-400 transition-colors hover:cursor-pointer"
          >
            {/* Ícono animado */}
            <motion.span
              key={isOpen ? 'minus' : 'plus'}
              initial={{ rotate: isOpen ? 90 : -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: isOpen ? -90 : 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-2xl leading-none font-bold"
            >
              {isOpen ? '−' : '+'}
            </motion.span>
          </Button>
          {newEdit.id !== -1 && (
            <BubbleInfo
              content={`Editando: ${newEdit.titulo}`}
              onClose={() => {
                setNewEdit(defaultEdit);
              }}
            />
          )}
        </div>

        {/* Formulario animado */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="news-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <NewsForm
                tags={tags}
                new={newEdit}
                onSubmit={() => {
                  setNewEdit(defaultEdit);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {/* Listado de novedades */}
      <Suspense fallback={<NewsListSkeleton count={3} />}>
        {news.status !== 200 ? (
          <h2 className="text-xl font-bold text-red-900">
            No se han podido cargar las novedades...
          </h2>
        ) : !news.data ? (
          <h2 className="text-xl font-bold text-black">
            No hay novedades por el momento...
          </h2>
        ) : (
          <NewsList
            onEdit={(newToEdit) => {
              if (newToEdit.id !== newEdit.id) setNewEdit(newToEdit);
            }}
            news={news.data}
          />
        )}
      </Suspense>
    </div>
  );
}
