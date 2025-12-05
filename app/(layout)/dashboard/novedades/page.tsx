// app/news/page.tsx
import News from '@/components/news/news';
import { retrieveNews } from '@/features/news/news';
import { retrieveTags } from '@/features/news/tags';

// Aquí se hace SSR para traer las novedades
export default async function NewsPage() {
  const resultNews = await retrieveNews();
  const resultTags = await retrieveTags();

  return <News news={resultNews} tags={resultTags.data} />;
}
