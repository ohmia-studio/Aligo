import { LoaderProvider } from '@/components/providers/loaderProvider';
import { ThemeProvider } from '@/components/providers/themeProvider';
import { ReduxProvider } from '@/store/ReduxProvider';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import LoaderLayout from './loaderLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aligo',
  description: 'Distribuidora mayorista de golosinas en Tres Arroyos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <LoaderProvider>
                <LoaderLayout>{children}</LoaderLayout>
              </LoaderProvider>
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
