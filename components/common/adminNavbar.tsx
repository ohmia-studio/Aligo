'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  ClipboardPenLineIcon,
  ClipboardPlusIcon,
  UserSearchIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminNavbar() {
  const [isHovered, setIsHovered] = useState(false);

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
      className="bg-accent/60 border-accent-foreground/30 hover:bg-accent fixed top-0 left-1/2 z-50 flex h-16 w-[30rem] -translate-x-1/2 items-center justify-center rounded-full border px-4 py-3 shadow-xl backdrop-blur-md transition-colors"
    >
      <ul className="flex flex-row items-center justify-center gap-14 text-2xl">
        <li className="transition-transform hover:scale-110">
          <Link href="/news">
            <Tooltip>
              <TooltipTrigger className="hover:cursor-pointer">
                <ClipboardPlusIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Agregar novedad</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </li>
        <li className="transition-transform hover:scale-110">
          <Link href="/news">
            <Tooltip>
              <TooltipTrigger className="hover:cursor-pointer">
                <ClipboardPenLineIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar novedad</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </li>
        <li className="transition-transform hover:scale-110">
          <Link href="/news">
            <Tooltip>
              <TooltipTrigger className="hover:cursor-pointer">
                <UserSearchIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Buscar empleado</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </li>
      </ul>
    </motion.nav>
  );
}
