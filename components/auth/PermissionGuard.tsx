'use client';
import { RootState } from '@/store/store';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface PermissionGuardProps {
  requiredRoles: ('admin' | 'empleado' | 'usuario')[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  requiredRoles,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !requiredRoles.includes(user.rol)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook personalizado para verificar permisos
export function usePermissions() {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    isAdmin: user?.rol === 'admin',
    isEmployee: user?.rol === 'empleado',
    isUser: user?.rol === 'usuario',
    hasRole: (role: 'admin' | 'empleado' | 'usuario') => user?.rol === role,
    hasAnyRole: (roles: ('admin' | 'empleado' | 'usuario')[]) =>
      user ? roles.includes(user.rol) : false,
  };
}

export function getHomeRoute(): string {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return '/dashboard';
  switch (user.rol) {
    case 'admin':
      return '/dashboard/admin';
    case 'empleado':
      return '/dashboard/empleados';
    default:
      return '/dashboard';
  }
}
