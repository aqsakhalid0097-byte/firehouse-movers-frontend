'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Forbidden403Page } from '../routes/Forbidden403Page';
import { getUserRoleSlug } from '../utils/rbac';
import type { AuthUser } from '../api/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowedRoles?: readonly string[] | string[];
  checkAccess?: (user: AuthUser | null) => boolean;
  forbiddenTitle?: string;
  forbiddenMessage?: string;
}

/**
 * Route guard component that restricts access to authenticated users only
 * and optionally validates role-based permissions (RBAC).
 *
 * - Unauthenticated users are redirected to /login (or custom redirectTo).
 * - Authenticated users who lack required roles/permissions are shown the 403 Forbidden page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  allowedRoles,
  checkAccess,
  forbiddenTitle,
  forbiddenMessage,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`${redirectTo}?from=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-medium">Verifying session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If custom checkAccess predicate is provided, evaluate it
  if (checkAccess && !checkAccess(user)) {
    return (
      <Forbidden403Page
        title={forbiddenTitle || 'Restricted Access'}
        message={
          forbiddenMessage ||
          'Your account role does not have permission to view this operational zone.'
        }
      />
    );
  }

  // If allowedRoles list is provided, verify user's role slug is included
  if (allowedRoles && allowedRoles.length > 0) {
    const roleSlug = getUserRoleSlug(user);
    const hasRole = user?.is_superuser || allowedRoles.includes(roleSlug);
    if (!hasRole) {
      return (
        <Forbidden403Page
          title={forbiddenTitle || 'Restricted Access'}
          message={
            forbiddenMessage ||
            'Your account role does not have permission to view this operational zone.'
          }
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
