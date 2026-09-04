'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AwardsPage } from '@/routes/AwardsPage';

export default function AwardsRoutePage() {
  return (
    <ProtectedRoute>
      <AwardsPage />
    </ProtectedRoute>
  );
}
