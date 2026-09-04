import React from 'react';

interface InspectionReportFormProps {
  startDate: string;
  endDate: string;
  selectedTruck: string;
  selectedTrailer: string;
  selectedReport: string;
  trucks: Array<{ id: string; name: string }>;
  trailers: Array<{ id: string; name: string }>;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onTruckChange: (val: string) => void;
  onTrailerChange: (val: string) => void;
  onReportChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InspectionReportForm: React.FC<InspectionReportFormProps> = ({
  startDate,
  endDate,
  selectedTruck,
  selectedTrailer,
  selectedReport,
  trucks,
  trailers,
  onStartDateChange,
  onEndDateChange,
  onTruckChange,
  onTrailerChange,
  onReportChange,
  onSubmit,
}) => {
  const getReportDescription = (report: string) => {
    switch (report) {
      case 'frequency':
        return 'This report shows how often each vehicle is being inspected and highlights vehicles that have not been inspected recently.';
      case 'equipment':
        return "This report lists all items marked as 'Missing-Not Restocked' for each vehicle, helping prioritize restocking efforts.";
      case 'comparison':
        return 'This report compares inspection results between drivers and operations managers for the same vehicle, highlighting discrepancies.';
      case 'readiness':
        return 'This report provides a quick overview of which vehicles are fully equipped and ready for use based on their latest inspection.';
      case 'activity':
        return 'This report shows how many inspections each user (driver or operations manager) has completed within the selected date range.';
      default:
        return 'Select a report to see its description here.';
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Date and Vehicle Information Container */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-white font-medium mb-1.5 text-sm">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm [color-scheme:dark]"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-white font-medium mb-1.5 text-sm">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm [color-scheme:dark]"
            />
          </div>

          <div>
            <label htmlFor="truck" className="block text-white font-medium mb-1.5 text-sm">
              Select Truck:
            </label>
            <select
              id="truck"
              name="truck"
              value={selectedTruck}
              onChange={(e) => onTruckChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="">All</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id} className="bg-[#1a1a1a] text-white">
                  {truck.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="trailer" className="block text-white font-medium mb-1.5 text-sm">
              Select Trailer:
            </label>
            <select
              id="trailer"
              name="trailer"
              value={selectedTrailer}
              onChange={(e) => onTrailerChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="">All</option>
              {trailers.map((trailer) => (
                <option key={trailer.id} value={trailer.id} className="bg-[#1a1a1a] text-white">
                  {trailer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Selection Container */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 shadow-sm">
        <label htmlFor="report" className="block text-white font-medium mb-1.5 text-sm">
          Select Report:
        </label>
        <select
          id="report"
          name="report"
          value={selectedReport}
          onChange={(e) => onReportChange(e.target.value)}
          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
        >
          <option value="">Select a Report</option>
          <option value="frequency" className="bg-[#1a1a1a] text-white">
            Inspection Frequency Report
          </option>
          <option value="equipment" className="bg-[#1a1a1a] text-white">
            Missing Equipment Report
          </option>
          <option value="comparison" className="bg-[#1a1a1a] text-white">
            Driver V/S Operation Manager Inspection Comparison
          </option>
          <option value="readiness" className="bg-[#1a1a1a] text-white">
            Vehicle Readiness Report
          </option>
          <option value="activity" className="bg-[#1a1a1a] text-white">
            User Activity Report
          </option>
        </select>
      </div>

      {/* Dynamic Report Description */}
      <div id="report-description" className="mt-4 text-gray-400 text-sm italic min-h-[24px]">
        <p>{getReportDescription(selectedReport)}</p>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-2">
        <button
          type="submit"
          className="text-white font-medium py-2 px-6 bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-300 rounded shadow-md cursor-pointer text-sm inline-flex items-center justify-center"
        >
          Generate Report
        </button>
      </div>
    </form>
  );
};
