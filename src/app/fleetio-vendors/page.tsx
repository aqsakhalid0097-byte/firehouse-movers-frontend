'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioVendorsPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioVendorsRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioVendorsPage />
    </ProtectedRoute>
  );
}
