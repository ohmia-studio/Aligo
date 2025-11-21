// app/dashboard/layout.tsx
'use client';

import { AppSidebar } from '@/components/common/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //bg-gradient-to-br from-green-100  via-white to-indigo-100
    // <div className="flex min-h-screen flex-col">
    /*
    <SidebarProvider>
      <AppSidebar title={'Dashboard'} />
      <SidebarInset>
        <div className="background-gradient flex min-h-screen flex-col">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <main className="animate-fade-in flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-5xl px-2 py-8 sm:px-6 lg:px-10">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
*/
    // </div>

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="background-gradient flex min-h-screen flex-col">
          <div className="background-gradient flex flex-1 flex-col gap-4 p-4 pt-0">
            <SidebarTrigger className="mt-4 border-0 bg-transparent py-4 hover:cursor-pointer" />
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
