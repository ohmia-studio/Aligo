'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { logoutUser } from '@/features/auth/logout';
import { clearUser } from '@/store/authSlice';
import { RootState } from '@/store/store';
import {
  ArchiveIcon,
  ClipboardPenLineIcon,
  ClipboardPlusIcon,
  HomeIcon,
  LogOutIcon,
  UserSearchIcon,
  UsersIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AdminNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.rol === 'admin';

  const getHomeRoute = () => {
    if (!user) return '/dashboard';
    switch (user.rol) {
      case 'admin':
        return '/dashboard/admin';
      case 'empleado':
        return '/dashboard/empleados';
      default:
        return '/dashboard';
    }
  };

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const res = await logoutUser();
        if (res?.status === 200) {
          dispatch(clearUser());
          router.push('/login');
        } else {
          console.error('Logout error', res);
        }
      } catch (err) {
        console.error('Logout exception', err);
      }
    });
  };

  return (
    <motion.nav
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ y: '-70%' }} // posición inicial (solo una franja visible)
      animate={{ y: isHovered ? '0%' : '-70%' }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 20,
        duration: 0.4,
      }}
      className="bg-accent/60 border-accent-foreground/30 hover:bg-accent fixed top-0 left-1/2 z-50 flex h-16 w-[34rem] -translate-x-1/2 items-center justify-center rounded-full border px-4 py-3 shadow-xl backdrop-blur-md transition-colors"
    >
      <ul className="flex flex-row items-center justify-center gap-6 text-2xl">
        {/* Home */}
        <li className="transition-transform hover:scale-110">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={getHomeRoute()}
                className="flex items-center gap-2 text-base"
              >
                <HomeIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inicio</p>
            </TooltipContent>
          </Tooltip>
        </li>

        {/* Catálogos */}
        <li className="transition-transform hover:scale-110">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard/catalogos" className="flex items-center">
                <ArchiveIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Catálogos</p>
            </TooltipContent>
          </Tooltip>
        </li>

        {/* Contactos */}
        {isAdmin && (
          <li className="transition-transform hover:scale-110">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/admin/contactos"
                  className="flex items-center"
                >
                  <UsersIcon />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contactos</p>
              </TooltipContent>
            </Tooltip>
          </li>
        )}
        {/* Novedades: agregar / editar (solo admin) */}
        {isAdmin && (
          <>
            <li className="transition-transform hover:scale-110">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/news" className="flex items-center">
                    <ClipboardPlusIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar novedad</p>
                </TooltipContent>
              </Tooltip>
            </li>

            <li className="transition-transform hover:scale-110">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/news/editar"
                    className="flex cursor-pointer items-center"
                  >
                    <ClipboardPenLineIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar novedad</p>
                </TooltipContent>
              </Tooltip>
            </li>

            <li className="transition-transform hover:scale-110">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/admin/empleados"
                    className="flex cursor-pointer items-center"
                  >
                    <UserSearchIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Buscar empleado</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </>
        )}

        {/* Logout */}
        <li className="transition-transform hover:scale-110">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center"
                title="Cerrar sesión"
              >
                <LogOutIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPending ? 'Cerrando...' : 'Cerrar sesión'}</p>
            </TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </motion.nav>
  );
}
