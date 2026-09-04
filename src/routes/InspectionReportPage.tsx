'use client';

import React, { useState, useMemo } from 'react';
import { InspectionLayout } from '../features/inspection/InspectionLayout';
import { InspectionReportForm } from '../features/inspection/report/InspectionReportForm';
import { InspectionReportTables } from '../features/inspection/report/InspectionReportTables';
import { useInspectionVehicles, useInspectionReport, type InspectionReportParams } from '../api/inspectionApi';
import { Loader2 } from 'lucide-react';

export const InspectionReportPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] || '2026-08-31';

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [reportParams, setReportParams] = useState<InspectionReportParams | null>(null);

  const { data: trucksData } = useInspectionVehicles({ type: 'truck' });
  const { data: trailersData } = useInspectionVehicles({ type: 'trailer' });

  const trucks = useMemo(() => {
    if (trucksData && trucksData.length > 0) {
      return trucksData.map((v) => ({ id: String(v.id), name: v.display_name || v.name }));
    }
    return [];
  }, [trucksData]);

  const trailers = useMemo(() => {
    if (trailersData && trailersData.length > 0) {
      return trailersData.map((v) => ({ id: String(v.id), name: v.display_name || v.name }));
    }
    return [];
  }, [trailersData]);

  const { data: liveReportData, isFetching: isGeneratingReport } = useInspectionReport(
    reportParams || { report_type: 'frequency' },
    !!reportParams
  );

  const activeType = reportParams?.report_type || null;

  const frequencyData = useMemo(() => {
    return activeType === 'frequency' && liveReportData?.results ? (liveReportData.results as any[]) : [];
  }, [activeType, liveReportData]);

  const equipmentData = useMemo(() => {
    return activeType === 'equipment' && liveReportData?.results ? (liveReportData.results as any[]) : [];
  }, [activeType, liveReportData]);

  const readinessData = useMemo(() => {
    return activeType === 'readiness' && liveReportData?.results ? (liveReportData.results as any[]) : [];
  }, [activeType, liveReportData]);

  const activityData = useMemo(() => {
    return activeType === 'activity' && liveReportData?.results ? (liveReportData.results as any[]) : [];
  }, [activeType, liveReportData]);

  const comparisonData = useMemo(() => {
    return activeType === 'comparison' && liveReportData?.results ? (liveReportData.results as any[]) : [];
  }, [activeType, liveReportData]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) {
      alert('Please select a report type to generate.');
      return;
    }
    setReportParams({
      report_type: selectedReport as any,
      start_date: startDate,
      end_date: endDate,
      truck: selectedTruck || undefined,
      trailer: selectedTrailer || undefined,
    });
  };

  return (
    <InspectionLayout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="animate-heading text-3xl font-bold text-red-500 text-left">Report</h1>
          {isGeneratingReport && (
            <span className="inline-flex items-center gap-2 text-sm text-red-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </span>
          )}
        </div>

        <InspectionReportForm
          startDate={startDate}
          endDate={endDate}
          selectedTruck={selectedTruck}
          selectedTrailer={selectedTrailer}
          selectedReport={selectedReport}
          trucks={trucks}
          trailers={trailers}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onTruckChange={setSelectedTruck}
          onTrailerChange={setSelectedTrailer}
          onReportChange={setSelectedReport}
          onSubmit={handleGenerateReport}
        />
        <InspectionReportTables
          activeReportType={activeType}
          frequencyData={frequencyData}
          equipmentData={equipmentData}
          readinessData={readinessData}
          activityData={activityData}
          comparisonData={comparisonData}
          endDate={endDate}
        />
      </div>
    </InspectionLayout>
  );
};

export default InspectionReportPage;
