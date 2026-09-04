import React from 'react';
import type {
  FrequencyItem,
  MissingEquipmentItem,
  ReadinessItem,
  UserActivityItem,
  ComparisonItem,
} from './reportTypes';

interface InspectionReportTablesProps {
  activeReportType: string | null;
  frequencyData: FrequencyItem[];
  equipmentData: MissingEquipmentItem[];
  readinessData: ReadinessItem[];
  activityData: UserActivityItem[];
  comparisonData: ComparisonItem[];
  endDate: string;
}

export const InspectionReportTables: React.FC<InspectionReportTablesProps> = ({
  activeReportType,
  frequencyData,
  equipmentData,
  readinessData,
  activityData,
  comparisonData,
  endDate,
}) => {
  if (!activeReportType) return null;

  return (
    <div className="mt-8">
      {activeReportType === 'frequency' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-white">Generated Report</h2>
          {frequencyData.length > 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg overflow-hidden shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#262626] text-white text-sm">
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Vehicle</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Type</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Inspection Count</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Last Inspection Date</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Days Since Last Inspection</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {frequencyData.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{item.vehicleName || (item as any).vehicle_name}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{item.vehicleType || (item as any).vehicle_type}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{item.inspectionCount ?? (item as any).inspection_count}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{item.lastInspection ?? (item as any).last_inspection ?? 'Never'}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{item.inspectionDifference ?? (item as any).days_since_last_inspection ?? 0} Days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-8 text-center text-gray-400">
              No inspection records found for the selected date range and vehicles.
            </div>
          )}
        </div>
      )}

      {activeReportType === 'equipment' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-white">Generated Report</h2>
          {equipmentData.length > 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg overflow-hidden shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#262626] text-white text-sm">
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Vehicle</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Missing-Not Restocked Items</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Inspection Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {equipmentData.map((report, idx) => (
                    <tr key={report.id} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b] font-medium">{report.vehicleName || (report as any).vehicle_name}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">
                        <ul className="space-y-1">
                          {(report.missingItems || (report as any).missing_items || []).map((item: any, i: number) => (
                            <li key={i} className="text-red-300">• {typeof item === 'string' ? item : item.item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">
                        {(report.missingItems as any)?.[0]?.inspectionDate || (report.missingItems as any)?.[0]?.inspection_date || endDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-8 text-center text-gray-400">
              No missing equipment records found for the selected date range.
            </div>
          )}
        </div>
      )}

      {activeReportType === 'readiness' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-white">Vehicle Readiness Report</h2>
          {readinessData.length > 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg overflow-hidden shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#262626] text-white text-sm">
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Vehicle</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Vehicle Type</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Last Inspection</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Readiness Score (%)</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Ready Items</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Total Items</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {readinessData.map((report, idx) => {
                    const score = report.readinessScore ?? (report as any).readiness_score ?? 0;
                    return (
                      <tr key={report.id} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b] font-medium">{report.vehicleName || (report as any).vehicle_name}</td>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.vehicleType || (report as any).vehicle_type}</td>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.lastInspection || (report as any).last_inspection || 'N/A'}</td>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b]">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            score >= 90
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.readyItems ?? (report as any).ready_items ?? 0}</td>
                        <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.totalItems ?? (report as any).total_items ?? 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-8 text-center text-gray-400">
              No readiness evaluation records found for the selected vehicles.
            </div>
          )}
        </div>
      )}

      {activeReportType === 'activity' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-white">User Activity Report</h2>
          {activityData.length > 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg overflow-hidden shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#262626] text-white text-sm">
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">User</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Role</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Inspection Count</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Last Inspection Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {activityData.map((user, idx) => (
                    <tr key={user.id} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b] font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b] capitalize">{user.role}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{user.inspectionsCount ?? (user as any).inspections_count ?? 0}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{user.lastInspectionDate || (user as any).last_inspection_date || 'Never'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-8 text-center text-gray-400">
              No user inspection activity found for the selected date range.
            </div>
          )}
        </div>
      )}

      {activeReportType === 'comparison' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-white">Inspection Comparison Report</h2>
          {comparisonData.length > 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg overflow-hidden shadow-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#262626] text-white text-sm">
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Vehicle</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Driver</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Manager</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Inspection Date</th>
                    <th className="px-6 py-3 text-left border border-[#2b2b2b] font-medium">Discrepancies</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {comparisonData.map((report, idx) => (
                    <tr key={report.id} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b] font-medium">{report.vehicle}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.driver}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.manager}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">{report.inspectionDate || (report as any).inspection_date}</td>
                      <td className="px-6 py-4 text-white border border-[#2b2b2b]">
                        <ul className="list-disc pl-6 space-y-1 text-amber-300">
                          {(report.discrepancies || []).map((disc: string, i: number) => (
                            <li key={i}>{disc}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-8 text-center text-gray-400">
              No comparison records or discrepancies found for the selected date range.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
