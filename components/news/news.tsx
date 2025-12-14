'use client';

import { NewEdit, TagItem } from '@/interfaces/news-interfaces';
import { Result } from '@/interfaces/server-response-interfaces';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useEffect, useState } from 'react';
import { usePermissions } from '../auth/PermissionGuard';
import ServerErrorPage from '../page/serverErrorPage';
import { Button } from '../ui/button';
import BubbleInfo from './bubbleInfo';
import NewsFilters from './NewsFilters';
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
  const { isAdmin } = usePermissions();
  const [filters, setFilters] = useState({
    query: '',
    tagName: null as string | null,
    sortBy: 'recent' as 'recent' | 'oldest',
  });

  const filteredNews = (Array.isArray(news.data) ? news.data : [])
    .filter((n: any) => {
      const q = (filters.query || '').toLowerCase();
      const titulo = (
        typeof n.titulo === 'string' ? n.titulo : ''
      ).toLowerCase();
      const desc =
        typeof n.descripcion === 'string' ? n.descripcion.toLowerCase() : '';
      const matchesQuery = q ? titulo.includes(q) || desc.includes(q) : true;
      const matchesTag =
        filters.tagName === null ? true : (n.tag || '') === filters.tagName;
      return matchesQuery && matchesTag;
    })
    .sort((a: any, b: any) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return filters.sortBy === 'recent' ? db - da : da - db;
    });

  useEffect(() => {
    if (!isOpen && newEdit.id !== -1) setIsOpen(true);
    else if (isOpen && newEdit.id === -1) setIsOpen(false);
  }, [newEdit]);

  return (
    <Suspense fallback={<NewsListSkeleton count={3} />}>
      {news.status !== 200 ? (
        <ServerErrorPage errorCode={news.status} />
      ) : (
        <div className="space-y-8 p-0 md:p-6">
          <NewsFilters tags={tags} value={filters} onChange={setFilters} />
          <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-4">
              <h1 className="text-base-color">Novedades</h1>

              {/* Ícono animado */}
              {isAdmin && (
                <>
                  <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    type="button"
                    className="hover:border-primary border-accent relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-colors hover:cursor-pointer"
                  >
                    <motion.span
                      key={isOpen ? 'minus' : 'plus'}
                      initial={{ rotate: isOpen ? 90 : -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: isOpen ? -90 : 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-accent absolute text-2xl leading-none font-bold"
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
                </>
              )}
            </div>

            {/* Formulario animado */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="news-form"
                  initial={{ opacity: 0, height: 'var(--scale-from,0)' }}
                  animate={{ opacity: 1, height: 'var(--scale-to,1)' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden [--scale-from:0] [--scale-to:83svh] md:[--scale-to:80svh]"
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

          <NewsList
            onEdit={(newToEdit) => {
              if (newToEdit.id !== newEdit.id) setNewEdit(newToEdit);
            }}
            news={filteredNews}
            hasPermission={isAdmin}
          />
        </div>
      )}
    </Suspense>
  );
}
