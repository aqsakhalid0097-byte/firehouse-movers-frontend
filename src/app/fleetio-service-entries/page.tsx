'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioServiceEntriesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioServiceEntriesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioServiceEntriesPage />
    </ProtectedRoute>
  );
}
