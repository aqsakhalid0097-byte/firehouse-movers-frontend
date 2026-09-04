'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LogDashboardPage } from '@/routes/LogDashboardPage';

export default function CommunicationDashboardRoutePage() {
  return (
    <ProtectedRoute>
      <LogDashboardPage />
    </ProtectedRoute>
  );
}
