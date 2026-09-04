'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioMeterEntriesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioMeterEntriesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioMeterEntriesPage />
    </ProtectedRoute>
  );
}
