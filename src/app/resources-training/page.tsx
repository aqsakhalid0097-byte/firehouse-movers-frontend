'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ResourcesTrainingPage } from '@/routes/ResourcesTrainingPage';

export default function ResourcesTrainingRoutePage() {
  return (
    <ProtectedRoute>
      <ResourcesTrainingPage />
    </ProtectedRoute>
  );
}
