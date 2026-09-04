'use client';

import React, { useState, useMemo } from 'react';
import { InspectionLayout } from '../features/inspection/InspectionLayout';
import { TruckInspectionForm } from '../features/inspection/truck/TruckInspectionForm';
import { useTruckInspectionConfig, useSubmitTruckInspection, type TruckInspectionCreatePayload } from '../api/inspectionApi';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const VehicleInspectionPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] || '2026-08-31';
  const [date, setDate] = useState(today);
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: configData } = useTruckInspectionConfig();
  const submitMutation = useSubmitTruckInspection();

  const trucks = useMemo(() => {
    if (configData?.active_trucks && configData.active_trucks.length > 0) {
      return configData.active_trucks.map((v) => ({
        id: String(v.id || v.fleetio_id || ''),
        name: v.display_name || v.name || `Truck #${v.id}`,
      }));
    }
    return [];
  }, [configData]);

  const handleSubmit = (payload: TruckInspectionCreatePayload) => {
    setErrorMessage(null);
    submitMutation.mutate(payload, {
      onSuccess: () => {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err: any) => {
        const msg = err?.data?.message || err?.data?.detail || 'Failed to submit inspection. Please try again.';
        setErrorMessage(msg);
      },
    });
  };

  return (
    <InspectionLayout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6 text-left">Truck Inspection Form</h1>

        {isSubmitted && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                Truck inspection for <strong>{trucks.find((t) => t.id === selectedTruckId)?.name || 'Truck'}</strong> has been successfully submitted and saved.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs underline text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Start New Inspection
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <TruckInspectionForm
          date={date}
          selectedTruckId={selectedTruckId}
          trucks={trucks}
          isSubmitting={submitMutation.isPending}
          onDateChange={setDate}
          onTruckChange={setSelectedTruckId}
          onSubmit={handleSubmit}
        />
      </div>
    </InspectionLayout>
  );
};

export default VehicleInspectionPage;
