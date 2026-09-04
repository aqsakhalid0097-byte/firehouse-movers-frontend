'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TeamPage } from '@/routes/TeamPage';

export default function TeamRoutePage() {
  return (
    <ProtectedRoute>
      <TeamPage />
    </ProtectedRoute>
  );
}
