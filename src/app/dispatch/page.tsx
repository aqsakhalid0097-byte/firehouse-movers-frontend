'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DispatchPage } from '@/routes/DispatchPage';
import { isDispatcher } from '@/utils/rbac';

export default function DispatchRoutePage() {
  return (
    <ProtectedRoute
      checkAccess={isDispatcher}
      forbiddenTitle="Management Access Required"
      forbiddenMessage="Live Dispatch console is restricted to Management and Dispatchers (CEO, VP, Admin, Manager, LLC/Owner). Drivers, movers, and non-management crew are restricted from dispatch operations."
    >
      <DispatchPage />
    </ProtectedRoute>
  );
}
