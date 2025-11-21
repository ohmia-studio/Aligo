'use client';
import { SpinnerLoader } from '@/components/common/spinnerLoader';
import { useLoader } from '@/components/providers/loaderProvider';
import { RouteChangeLoader } from '@/components/providers/routeChangeLoader';

export default function LoaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoader();

  return (
    <>
      <RouteChangeLoader />
      <SpinnerLoader show={isLoading} />
      {children}
    </>
  );
}
