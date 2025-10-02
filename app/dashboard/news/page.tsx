// app/news/page.tsx
import NewsForm from '@/components/news/newsForm';
import NewsList from '@/components/news/newsList';
import NewsListSkeleton from '@/components/news/newsListSkeleton';
import { retrieveNews } from '@/features/news/news';
import { retrieveTags } from '@/features/news/tags';
import { Suspense } from 'react';
// ✅ Page es un Server Component por defecto en Next.js
// Aquí se hace SSR para traer las novedades
export default async function NewsPage() {
  const resultNews = await retrieveNews();
  const resultTags = await retrieveTags();

  if (resultNews.status !== 200) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">
          Error al cargar las novedades
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Novedades</h1>
      {/* Formulario para crear nueva novedad */}
      <NewsForm tags={resultTags.data} />
      {/* Listado de novedades */}
      <Suspense fallback={<NewsListSkeleton count={3} />}>
        <NewsList news={resultNews.data} />
      </Suspense>
    </div>
  );
}
