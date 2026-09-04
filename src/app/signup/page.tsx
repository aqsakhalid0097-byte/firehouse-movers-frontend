'use client';

import { GuestRoute } from '@/components/GuestRoute';
import { SignupPage } from '@/routes/SignupPage';

export default function SignupRoutePage() {
  return (
    <GuestRoute redirectTo="/">
      <SignupPage />
    </GuestRoute>
  );
}
