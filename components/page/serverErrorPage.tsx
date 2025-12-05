import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getHomeRoute } from '../auth/PermissionGuard';
import { Button } from '../ui/button';

export default function ServerErrorPage({ errorCode }: { errorCode: number }) {
  const router = useRouter();
  return (
    <>
      <section className="my-auto flex flex-col items-center gap-8 justify-self-center px-4">
        <h1 className="text-destructive text-shadow-destructive text-center text-6xl text-shadow-md">
          {errorCode}
        </h1>
        <div className="flex flex-col gap-1">
          <h2>Puede fallar... 🤦</h2>
          <p>Hubo un error inesperado, perdone las molestias 🫠</p>
          <div className="flex flex-row gap-4">
            <Button
              variant={'default'}
              className="text-base-color-foreground hover:cursor-pointer"
            >
              <Link href={getHomeRoute()}>Volver al Home</Link>
            </Button>
            <Button
              variant={'outline'}
              className="hover:cursor-pointer"
              onClick={() => router.refresh()}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
