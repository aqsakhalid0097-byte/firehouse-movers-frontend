'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PackagingPage } from '@/routes/PackagingPage';
import { isInternalStaff } from '@/utils/rbac';

export default function PackagingRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isInternalStaff}
      forbiddenTitle="Staff Only Area"
      forbiddenMessage="Packaging supplies and materials warehouse is accessible to all 13 internal staff roles only."
    >
      <PackagingPage />
    </ProtectedRoute>
  );
}
