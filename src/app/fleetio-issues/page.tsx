'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioIssuesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioIssuesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioIssuesPage />
    </ProtectedRoute>
  );
}
