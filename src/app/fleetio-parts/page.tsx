'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioPartsPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioPartsRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioPartsPage />
    </ProtectedRoute>
  );
}
