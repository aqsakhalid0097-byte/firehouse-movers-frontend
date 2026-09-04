import React, { useState } from 'react';
import { SignatureCanvas } from '../SignatureCanvas';
import type { TrailerInspectionCreatePayload } from '../../../api/inspectionApi';
import { Loader2 } from 'lucide-react';

interface TrailerInspectionFormProps {
  date: string;
  selectedTrailerId: string;
  trailers: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
  onDateChange: (val: string) => void;
  onTrailerChange: (val: string) => void;
  onSubmit: (payload: TrailerInspectionCreatePayload) => void;
}

export const TrailerInspectionForm: React.FC<TrailerInspectionFormProps> = ({
  date,
  selectedTrailerId,
  trailers,
  isSubmitting = false,
  onDateChange,
  onTrailerChange,
  onSubmit,
}) => {
  const [safetyChecks, setSafetyChecks] = useState<Record<string, string>>({
    running_lights: 'pass',
    turn_signals: 'pass',
    brake_lights: 'pass',
    interior_ramp_lights: 'pass',
    trailer_brakes: 'pass',
    breakaway_switch: 'pass',
    tires_condition: 'pass',
    safety_chains: 'pass',
  });

  const [equipmentChecks, setEquipmentChecks] = useState<Record<string, string>>({
    blanket_84: 'present',
    hand_trucks_with_covers: 'present',
    four_wheel_dolly: 'present',
    short_straps: 'present',
    long_straps: 'present',
    ramp: 'present',
    rubber_bands: 'present',
    red_floor_runner: 'present',
    forearm_straps: 'present',
    wardrobe_boxes_with_bars: 'present',
    tv_box_for_rental: 'present',
    multi_tool_set: 'present',
    hand_tools_bag: 'present',
    two_carabiner: 'present',
    broom: 'present',
    trash: 'already clean',
  });

  const [signatureData, setSignatureData] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrailerId) {
      alert('Please select a trailer to inspect.');
      return;
    }

    const payload: TrailerInspectionCreatePayload = {
      date,
      trailer_id: Number(selectedTrailerId) || undefined,
      trash: equipmentChecks.trash || 'already clean',
      reviewing_drivers_signature: signatureData || 'Digital Signature Stored',
      safety_items: safetyChecks,
      supplies_items: equipmentChecks,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Date and Trailer Information */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_date" className="block text-white font-medium mb-1.5 text-sm">
              Inspection Date
            </label>
            <input
              type="date"
              id="id_date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm [color-scheme:dark]"
            />
          </div>

          <div>
            <label htmlFor="id_fleetio_trailer_id" className="block text-white font-medium mb-1.5 text-sm">
              Trailer
            </label>
            <select
              id="id_fleetio_trailer_id"
              value={selectedTrailerId}
              onChange={(e) => onTrailerChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="">Select a trailer</option>
              {trailers.map((trailer) => (
                <option key={trailer.id} value={trailer.id} className="bg-[#1a1a1a] text-white">
                  {trailer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Safety & Function Section */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">Safety / Function</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(safetyChecks).map(([key, val]) => (
            <div key={key}>
              <label className="block text-white font-medium mb-1.5 text-sm capitalize">{key.replace(/_/g, ' ')}</label>
              <select
                value={val}
                onChange={(e) => setSafetyChecks({ ...safetyChecks, [key]: e.target.value })}
                className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
              >
                <option value="pass" className="bg-[#1a1a1a]">Pass</option>
                <option value="fail" className="bg-[#1a1a1a]">Fail</option>
                <option value="needs_attention" className="bg-[#1a1a1a]">Needs Attention</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">Equipment & Supplies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(equipmentChecks).map(([key, val]) => (
            <div key={key}>
              <label className="block text-white font-medium mb-1.5 text-sm capitalize">{key.replace(/_/g, ' ')}</label>
              <select
                value={val}
                onChange={(e) => setEquipmentChecks({ ...equipmentChecks, [key]: e.target.value })}
                className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
              >
                <option value="present" className="bg-[#1a1a1a]">Present</option>
                <option value="missing restocked" className="bg-[#1a1a1a]">Missing Restocked</option>
                <option value="missing-not restocked" className="bg-[#1a1a1a]">Missing-Not Restocked</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">Reviewing Driver's Signature</h2>
        <p className="text-gray-400 text-sm">Please provide your digital signature to complete the inspection.</p>
        <SignatureCanvas onDataUrlChange={setSignatureData} />
      </div>

      {/* Submit Button */}
      <div className="text-right pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white font-medium py-2 px-6 bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-300 rounded shadow-md cursor-pointer text-sm inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Inspection'
          )}
        </button>
      </div>
    </form>
  );
};
