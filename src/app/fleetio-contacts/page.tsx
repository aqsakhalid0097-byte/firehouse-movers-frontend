'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioContactsPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioContactsRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioContactsPage />
    </ProtectedRoute>
  );
}
