'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TagItem } from '@/interfaces/news-interfaces';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

type Filters = {
  query: string;
  tagName: string | null;
  sortBy: 'recent' | 'oldest';
};

export default function NewsFilters({
  tags,
  value,
  onChange,
}: {
  tags: TagItem[];
  value: Filters;
  onChange: (next: Filters) => void;
}) {
  const [localQuery, setLocalQuery] = useState(value.query);
  const debounceRef = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = (next: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.query) params.set('q', next.query);
    else params.delete('q');
    if (next.tagName) params.set('tag', next.tagName);
    else params.delete('tag');
    if (next.sortBy && next.sortBy !== 'recent')
      params.set('sort', next.sortBy);
    else params.delete('sort');
    const href = `${pathname}?${params.toString()}`;
    router.replace(href);
  };

  const activeCount = useMemo(() => {
    let c = 0;
    if (value.query) c++;
    if (value.tagName !== null) c++;
    if (value.sortBy !== 'recent') c++;
    return c;
  }, [value]);

  const applyQuery = useCallback(
    (q: string) => {
      const next = { ...value, query: q };
      onChange(next);
      updateUrl(next);
    },
    [onChange, value]
  );

  const reset = () => {
    setLocalQuery('');
    const next: Filters = { query: '', tagName: null, sortBy: 'recent' };
    onChange(next);
    updateUrl(next);
  };

  return (
    <section className="bg-background/60 supports-[backdrop-filter]:bg-background/40 sticky top-0 z-10 flex w-full flex-col gap-2 rounded-xl p-2 shadow-sm backdrop-blur">
      <article className="flex items-center gap-2">
        <input
          value={localQuery}
          onChange={(e) => {
            const q = e.target.value;
            setLocalQuery(q);
            // lightweight debounce without globals
            if (debounceRef.current) {
              window.clearTimeout(debounceRef.current);
            }
            debounceRef.current = window.setTimeout(
              () => applyQuery(q),
              2000
            ) as unknown as number;
          }}
          placeholder="Buscar novedades..."
          className="bg-base-color/5 text-base-color placeholder:text-muted-foreground border-border w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[--tt-brand-color-300]"
        />
        {activeCount > 0 && (
          <Button
            variant="outline"
            type="button"
            onClick={reset}
            className="hover:border-primary text-base-color text-xs"
          >
            Limpiar ({activeCount})
          </Button>
        )}
      </article>

      {/* Mobile-friendly select for tags */}
      <article className="flex gap-2 md:hidden">
        <Select
          value={value.tagName ?? '__all__'}
          onValueChange={(val) => {
            const next = { ...value, tagName: val === '__all__' ? null : val };
            onChange(next);
            updateUrl(next);
          }}
        >
          <SelectTrigger className="text-base-color w-full">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" className="text-base-color">
              Todas
            </SelectItem>
            {tags.map((t) => (
              <SelectItem
                key={t.nombre}
                value={t.nombre}
                className="text-base-color"
              >
                {t.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </article>

      {/* Desktop chips */}
      <article
        role="radiogroup"
        aria-label="Filtrar por categoría"
        className="no-scrollbar -mx-1 hidden gap-2 overflow-x-auto px-1 py-1 md:flex"
      >
        <Chip
          role="radio"
          ariaChecked={value.tagName === null}
          active={value.tagName === null}
          label="Todas"
          onClick={() => {
            const next = { ...value, tagName: null };
            onChange(next);
            updateUrl(next);
          }}
        />
        {tags.map((t) => (
          <Chip
            key={t.nombre}
            role="radio"
            ariaChecked={value.tagName === t.nombre}
            active={value.tagName === t.nombre}
            label={t.nombre}
            onClick={() => {
              const next = { ...value, tagName: t.nombre };
              onChange(next);
              updateUrl(next);
            }}
          />
        ))}
      </article>

      <article className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Orden</span>
        <div className="flex gap-2">
          <SmallToggle
            active={value.sortBy === 'recent'}
            label="Recientes"
            onClick={() => onChange({ ...value, sortBy: 'recent' })}
          />
          <SmallToggle
            active={value.sortBy === 'oldest'}
            label="Antiguas"
            onClick={() => onChange({ ...value, sortBy: 'oldest' })}
          />
        </div>
      </article>
      <Separator className="opacity-40" />
    </section>
  );
}

function Chip({
  label,
  active,
  onClick,
  role,
  ariaChecked,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  role?: string;
  ariaChecked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      role={role}
      aria-checked={ariaChecked}
      className={
        'rounded-full px-3 py-1 text-xs transition-colors hover:cursor-pointer ' +
        (active
          ? 'bg-accent text-accent-foreground shadow'
          : 'bg-base-color/10 text-base-color')
      }
    >
      {label}
    </button>
  );
}

function SmallToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-md px-2 py-1 text-xs hover:cursor-pointer ' +
        (active
          ? 'bg-accent text-accent-foreground shadow'
          : 'bg-base-color/10 text-base-color')
      }
    >
      {label}
    </button>
  );
}
