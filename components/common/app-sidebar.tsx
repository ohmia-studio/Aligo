'use client';

import aligoIcon from '@/app/favicon.ico';
import { getHomeRoute } from '@/components/auth/PermissionGuard';
import { NavMain } from '@/components/common/nav-main';
import { NavUser } from '@/components/common/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NotebookText, SquareTerminal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../tiptap/tiptap-templates/theme-toggle';

// This is sample data.
const navData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Gestion Aligo',
      access: ['admin'],
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Contactos',
          url: '/dashboard/admin/contactos',
        },
        {
          title: 'Empleados',
          url: '/dashboard/admin/empleados',
        },
      ],
    },
    {
      title: 'Recursos',
      access: ['admin', 'empleado'],
      icon: NotebookText,
      items: [
        {
          title: 'Novedades',
          url: '/dashboard/novedades',
        },
        {
          title: 'Manuales',
          url: '/dashboard/manuales',
        },
        {
          title: 'Catalogos',
          url: '/dashboard/catalogos',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const auth = useSelector((state: any) => state.auth);
  const userFromState = auth?.user;
  const displayUser = {
    name: userFromState?.name || userFromState?.email || navData.user.name,
    email: userFromState?.email || navData.user.email,
    avatar: navData.user.avatar,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          className="hover:bg-base-color-foreground flex flex-row items-center gap-2 rounded-lg py-2 pl-2 transition-colors duration-200"
          href={getHomeRoute()}
        >
          <div className="bg-base-color/80 flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              className="flex aspect-square size-8 items-center justify-center rounded-lg"
              src={aligoIcon}
              alt="aligo distribuidora home image"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Dashboard</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
