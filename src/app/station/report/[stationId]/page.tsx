'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StationReportPage } from '@/routes/StationReportPage';
import { isManager } from '@/utils/rbac';

export default function StationReportRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Station Facility Reports are restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <StationReportPage />
    </ProtectedRoute>
  );
}
