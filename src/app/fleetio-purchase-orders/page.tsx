'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioPurchaseOrdersPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioPurchaseOrdersRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioPurchaseOrdersPage />
    </ProtectedRoute>
  );
}
