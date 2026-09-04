'use client';

import { GuestRoute } from '@/components/GuestRoute';
import { LoginPage } from '@/routes/LoginPage';

export default function LoginRoutePage() {
  return (
    <GuestRoute redirectTo="/">
      <LoginPage />
    </GuestRoute>
  );
}
