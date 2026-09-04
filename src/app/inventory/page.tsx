'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { InventoryPage } from '@/routes/InventoryPage';
import { isInternalStaff } from '@/utils/rbac';

export default function InventoryRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isInternalStaff}
      forbiddenTitle="Staff Only Area"
      forbiddenMessage="Inventory management is accessible to all 13 internal staff roles only. Customers cannot access internal inventory."
    >
      <InventoryPage />
    </ProtectedRoute>
  );
}
