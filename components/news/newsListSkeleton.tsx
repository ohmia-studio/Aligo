// components/news/SkeletonLoader.tsx
'use client';

type Props = { count?: number };

export default function NewsListSkeleton({ count = 3 }: Props) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="space-y-4" aria-busy="true" role="status">
      {items.map((k) => (
        <div
          key={k}
          className="flex flex-col gap-2 rounded-md border p-4 shadow-sm"
        >
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
