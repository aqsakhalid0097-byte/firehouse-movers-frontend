'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioFuelEntriesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioFuelEntriesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioFuelEntriesPage />
    </ProtectedRoute>
  );
}
