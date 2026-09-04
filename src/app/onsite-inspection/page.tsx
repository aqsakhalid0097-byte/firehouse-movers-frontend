'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OnsiteInspectionPage } from '@/routes/OnsiteInspectionPage';
import { isManager } from '@/utils/rbac';

export default function OnsiteInspectionRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="On-Site Inspection audits are restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <OnsiteInspectionPage />
    </ProtectedRoute>
  );
}
