'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DepartmentPage } from '@/routes/DepartmentPage';

export default function DepartmentRoutePage() {
  return (
    <ProtectedRoute>
      <DepartmentPage />
    </ProtectedRoute>
  );
}
