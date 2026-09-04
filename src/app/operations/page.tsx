'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthenticatedLandingPage } from '@/routes/AuthenticatedLandingPage';

export default function OperationsLandingPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedLandingPage />
    </ProtectedRoute>
  );
}
