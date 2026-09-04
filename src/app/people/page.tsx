'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PeoplePage } from '@/routes/PeoplePage';

export default function PeopleDirectoryPage() {
  return (
    <ProtectedRoute>
      <PeoplePage />
    </ProtectedRoute>
  );
}
