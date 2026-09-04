'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GiftCardsPage } from '@/routes/GiftCardsPage';
import { isInternalStaff } from '@/utils/rbac';

export default function GiftCardsRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isInternalStaff}
      forbiddenTitle="Staff Only Area"
      forbiddenMessage="Gift Card rewards dashboard is accessible to all internal staff members only."
    >
      <GiftCardsPage />
    </ProtectedRoute>
  );
}
