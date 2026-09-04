'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioVehicleAssignmentsPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioVehicleAssignmentsRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioVehicleAssignmentsPage />
    </ProtectedRoute>
  );
}
