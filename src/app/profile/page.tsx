'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfilePage } from '@/routes/ProfilePage';

export default function CurrentUserProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
