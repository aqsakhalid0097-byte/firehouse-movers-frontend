'use client';

import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GoalsPage } from '@/routes/GoalsPage';
import { Loader2 } from 'lucide-react';

function GoalsLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
      <p className="text-sm text-gray-400 font-medium">Loading goals…</p>
    </div>
  );
}

export default function GoalsRoutePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<GoalsLoading />}>
        <GoalsPage />
      </Suspense>
    </ProtectedRoute>
  );
}
