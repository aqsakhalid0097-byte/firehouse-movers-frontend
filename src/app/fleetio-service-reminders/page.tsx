'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioServiceRemindersPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioServiceRemindersRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioServiceRemindersPage />
    </ProtectedRoute>
  );
}
