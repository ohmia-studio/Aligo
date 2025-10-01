'use client';

import { New } from '@/interfaces/news-interfaces';
import { renderTiptapJSON } from '@/lib/tiptap/renderTipTap';

export default function NewsList({ news }: { news: New[] }) {
  if (news.length === 0)
    return <p className="text-gray-500">No hay novedades aún.</p>;

  return (
    <ul className="space-y-4">
      {news.map((n, index) => (
        <li key={index} className="space-y-2 rounded-lg border p-4 shadow-sm">
          <article>
            <h3 className="text-lg font-bold">{n.titulo}</h3>
            <section
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderTiptapJSON(n.descripcion),
              }}
            />
            {n.tag && (
              <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                {n.tag}
              </span>
            )}
            <p className="text-xs text-gray-500">Publicado el {n.created_at}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
