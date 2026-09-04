'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { InspectionReportPage } from '@/routes/InspectionReportPage';
import { isManager } from '@/utils/rbac';

export default function InspectionReportRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Inspection Reports are restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <InspectionReportPage />
    </ProtectedRoute>
  );
}
