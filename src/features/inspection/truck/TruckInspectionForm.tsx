import React, { useState } from 'react';
import { SignatureCanvas } from '../SignatureCanvas';
import type { TruckInspectionCreatePayload } from '../../../api/inspectionApi';
import { Loader2 } from 'lucide-react';

interface TruckInspectionFormProps {
  date: string;
  selectedTruckId: string;
  trucks: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
  onDateChange: (val: string) => void;
  onTruckChange: (val: string) => void;
  onSubmit: (payload: TruckInspectionCreatePayload) => void;
}

export const TruckInspectionForm: React.FC<TruckInspectionFormProps> = ({
  date,
  selectedTruckId,
  trucks,
  isSubmitting = false,
  onDateChange,
  onTruckChange,
  onSubmit,
}) => {
  const [cleanStatus, setCleanStatus] = useState('free of trash');
  const [inCabStatus, setInCabStatus] = useState('already clean');
  const [bedStatus, setBedStatus] = useState('already clean');
  const [cones, setCones] = useState('present');
  const [spareTire, setSpareTire] = useState('present');
  const [spareTireCondition, setSpareTireCondition] = useState('good');
  const [signatureData, setSignatureData] = useState('');

  const [inCabItems, setInCabItems] = useState<Record<string, string>>({
    first_aid_kit: 'present',
    floor_mats: 'present',
    business_cards: 'present',
    business_cards_magnetic: 'present',
    fuses: 'present',
    two_pens: 'present',
    sharpie: 'present',
    camera: 'present',
    flash_light: 'present',
    sun_visor: 'present',
    geo_tab: 'present',
    jack_and_links: 'present',
    cab_card: 'present',
    registration: 'present',
    insurance_card: 'present',
    accident_report_form: 'present',
    process_of_accident: 'present',
  });

  const [toolBoxItems, setToolBoxItems] = useState<Record<string, string>>({
    fire_extinguisher: 'present',
    four_way: 'present',
    min_7_orange: 'present',
    hazard_triangle_x3: 'present',
    jumper_cables: 'present',
    large_door_stops: 'present',
    trash_bag: 'present',
    roll_paper_towels: 'present',
    small_hand: 'present',
    bottle_jack: 'present',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruckId) {
      alert('Please select a truck to inspect.');
      return;
    }

    const payload: TruckInspectionCreatePayload = {
      date,
      truck_id: Number(selectedTruckId) || undefined,
      clean_status: cleanStatus,
      in_cab: inCabStatus,
      bed_of_truck: bedStatus,
      cones,
      spare_tire: spareTire,
      condition_spare_tyre: spareTireCondition,
      reviewing_drivers_signature: signatureData || 'Digital Signature Stored',
      in_cab_items: inCabItems,
      tool_box_items: toolBoxItems,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Date and Truck Information */}
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
            <label htmlFor="id_fleetio_truck_id" className="block text-white font-medium mb-1.5 text-sm">
              Truck
            </label>
            <select
              id="id_fleetio_truck_id"
              value={selectedTruckId}
              onChange={(e) => onTruckChange(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="">Select a truck</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id} className="bg-[#1a1a1a] text-white">
                  {truck.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Truck Status */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">Trash & Clean Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">Clean/Wash/Detailed</label>
            <select
              value={cleanStatus}
              onChange={(e) => setCleanStatus(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="free of trash" className="bg-[#1a1a1a]">Free of Trash</option>
              <option value="full of trash & dirt" className="bg-[#1a1a1a]">Full of Trash & Dirt</option>
              <option value="removed trash" className="bg-[#1a1a1a]">Removed Trash</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">In Cab</label>
            <select
              value={inCabStatus}
              onChange={(e) => setInCabStatus(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="already clean" className="bg-[#1a1a1a]">Already Clean</option>
              <option value="dirty now clean" className="bg-[#1a1a1a]">Dirty Now Clean</option>
              <option value="not clean" className="bg-[#1a1a1a]">Not Clean</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">Bed of Truck</label>
            <select
              value={bedStatus}
              onChange={(e) => setBedStatus(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="already clean" className="bg-[#1a1a1a]">Already Clean</option>
              <option value="dirty now clean" className="bg-[#1a1a1a]">Dirty Now Clean</option>
              <option value="not clean" className="bg-[#1a1a1a]">Not Clean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="bg-[#1a1a1a] border border-[#2b2b2b] p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">Equipment Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">(Bed of Truck) 4 Cones</label>
            <select
              value={cones}
              onChange={(e) => setCones(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="present" className="bg-[#1a1a1a]">Present</option>
              <option value="missing restocked" className="bg-[#1a1a1a]">Missing Restocked</option>
              <option value="missing-not restocked" className="bg-[#1a1a1a]">Missing-Not Restocked</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">(Under Bed Truck) Spare Tire</label>
            <select
              value={spareTire}
              onChange={(e) => setSpareTire(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="present" className="bg-[#1a1a1a]">Present</option>
              <option value="missing restocked" className="bg-[#1a1a1a]">Missing Restocked</option>
              <option value="missing-not restocked" className="bg-[#1a1a1a]">Missing-Not Restocked</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-1.5 text-sm">Condition of Spare Tire</label>
            <select
              value={spareTireCondition}
              onChange={(e) => setSpareTireCondition(e.target.value)}
              className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
            >
              <option value="good" className="bg-[#1a1a1a]">Good</option>
              <option value="normal" className="bg-[#1a1a1a]">Normal</option>
              <option value="damage" className="bg-[#1a1a1a]">Damage</option>
            </select>
          </div>
        </div>

        {/* In Cab */}
        <h2 className="text-lg font-semibold text-white pt-4 border-t border-[#2b2b2b]">In Cab</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(inCabItems).map(([key, val]) => (
            <div key={key}>
              <label className="block text-white font-medium mb-1.5 text-sm capitalize">{key.replace(/_/g, ' ')}</label>
              <select
                value={val}
                onChange={(e) => setInCabItems({ ...inCabItems, [key]: e.target.value })}
                className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm cursor-pointer"
              >
                <option value="present" className="bg-[#1a1a1a]">Present</option>
                <option value="missing restocked" className="bg-[#1a1a1a]">Missing Restocked</option>
                <option value="missing-not restocked" className="bg-[#1a1a1a]">Missing-Not Restocked</option>
              </select>
            </div>
          ))}
        </div>

        {/* Tool Box */}
        <h2 className="text-lg font-semibold text-white pt-4 border-t border-[#2b2b2b]">Tool Box</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(toolBoxItems).map(([key, val]) => (
            <div key={key}>
              <label className="block text-white font-medium mb-1.5 text-sm capitalize">{key.replace(/_/g, ' ')}</label>
              <select
                value={val}
                onChange={(e) => setToolBoxItems({ ...toolBoxItems, [key]: e.target.value })}
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
