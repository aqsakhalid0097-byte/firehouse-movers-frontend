'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioVehiclesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioVehiclesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioVehiclesPage />
    </ProtectedRoute>
  );
}
