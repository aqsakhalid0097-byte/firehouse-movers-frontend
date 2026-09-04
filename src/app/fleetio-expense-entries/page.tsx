'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FleetioExpenseEntriesPage } from '@/routes/fleetio/FleetioPages';
import { isManager } from '@/utils/rbac';

export default function FleetioExpenseEntriesRoutePage() {
  return (
    <ProtectedRoute checkAccess={isManager}>
      <FleetioExpenseEntriesPage />
    </ProtectedRoute>
  );
}
