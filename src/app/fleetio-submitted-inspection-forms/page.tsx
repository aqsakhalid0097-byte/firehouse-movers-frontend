'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioSubmittedFormsPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioSubmittedFormsRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioSubmittedFormsPage />
    </ProtectedRoute>
  );
}
