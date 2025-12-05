// components/news/SkeletonLoader.tsx
'use client';

type Props = { count?: number };

export default function NewsSkeleton({ count = 3 }: Props) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="p-6">
      <section className="space-y-4">
        <div className="flex flex-col gap-4">
          <h1 className="flex-start animate-pulse opacity-20">Novedades</h1>
          <div className="w-full space-y-4" aria-busy="true" role="status">
            {items.map((k) => (
              <div
                key={k}
                className="flex flex-col gap-2 rounded-md border p-4 shadow-sm"
              >
                <div className="bg-card h-6 w-1/3 animate-pulse rounded" />
                <div className="bg-card h-4 w-2/3 animate-pulse rounded" />
                <div className="bg-card h-24 w-full animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
