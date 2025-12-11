// app/news/page.tsx
import News from '@/components/news/news';
import { retrieveNews } from '@/features/news/news';
import { retrieveTags } from '@/features/news/tags';

// Aquí se hace SSR para traer las novedades
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    sort?: 'recent' | 'oldest';
  }>;
}) {
  const sp = await searchParams;
  const resultNews = await retrieveNews({
    query: sp?.q,
    tagName: sp?.tag ?? null,
    sort: sp?.sort ?? 'recent',
    limit: 20,
  });
  const resultTags = await retrieveTags();

  return <News news={resultNews} tags={resultTags.data} />;
}
