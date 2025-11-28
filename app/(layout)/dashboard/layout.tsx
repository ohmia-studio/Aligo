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
