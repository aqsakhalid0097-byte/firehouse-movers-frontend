'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioServiceTasksPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioServiceTasksRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioServiceTasksPage />
    </ProtectedRoute>
  );
}
