'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioWorkOrdersPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioWorkOrdersRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioWorkOrdersPage />
    </ProtectedRoute>
  );
}
