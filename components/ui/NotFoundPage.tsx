'use client';
import { RootState } from '@/store/store';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Button } from './button';

interface NotFoundPageProps {
  title?: string;
  message?: string;
  backUrl: string;
  backLabel: string;
}

export default function NotFoundPage({
  title = 'Recurso no encontrado',
  message = 'Los parámetros no son válidos o el recurso no existe.',
  backUrl,
  backLabel,
}: NotFoundPageProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const homeUrl = user?.rol === 'admin' ? '/dashboard/admin' : '/dashboard';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="bg-muted rounded-full p-6">
          <FileQuestion className="text-muted-foreground size-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href={backUrl}>{backLabel}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={homeUrl}>Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
