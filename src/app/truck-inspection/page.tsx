'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VehicleInspectionPage } from '@/routes/VehicleInspectionPage';
import { isManager } from '@/utils/rbac';

export default function TruckInspectionRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Vehicle Inspection checklists are restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <VehicleInspectionPage />
    </ProtectedRoute>
  );
}
