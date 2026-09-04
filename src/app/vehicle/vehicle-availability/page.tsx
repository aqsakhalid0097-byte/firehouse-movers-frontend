'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VehicleAvailabilityPage } from '@/routes/VehicleAvailabilityPage';
import { isManager } from '@/utils/rbac';

export default function VehicleAvailabilityRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Vehicle Availability & Logistics is restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <VehicleAvailabilityPage />
    </ProtectedRoute>
  );
}
