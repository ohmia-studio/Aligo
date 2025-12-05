// src/components/common/RouteChangeLoader.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useLoader } from './loaderProvider';

export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    showLoader();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => hideLoader(), 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchParams]);

  return null;
}
