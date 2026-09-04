'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerHomePage } from '@/routes/CustomerHomePage';

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute>
      <CustomerHomePage />
    </ProtectedRoute>
  );
}
