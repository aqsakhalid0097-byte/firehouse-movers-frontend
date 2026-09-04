'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerHomePage } from '@/routes/CustomerHomePage';

export default function CustomerPortalPage() {
  return (
    <ProtectedRoute>
      <CustomerHomePage />
    </ProtectedRoute>
  );
}
