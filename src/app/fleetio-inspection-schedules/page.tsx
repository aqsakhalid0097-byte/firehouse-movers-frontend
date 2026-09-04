'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioInspectionSchedulesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioInspectionSchedulesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioInspectionSchedulesPage />
    </ProtectedRoute>
  );
}
