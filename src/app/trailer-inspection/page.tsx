'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrailerInspectionPage } from '@/routes/TrailerInspectionPage';
import { isManager } from '@/utils/rbac';

export default function TrailerInspectionRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isManager}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Trailer Inspection checklists are restricted to Managers and Executives (CEO, VP, Admin, Manager, LLC/Owner)."
    >
      <TrailerInspectionPage />
    </ProtectedRoute>
  );
}
