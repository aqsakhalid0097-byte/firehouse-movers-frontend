'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioIssuePrioritiesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioIssuePrioritiesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioIssuePrioritiesPage />
    </ProtectedRoute>
  );
}
