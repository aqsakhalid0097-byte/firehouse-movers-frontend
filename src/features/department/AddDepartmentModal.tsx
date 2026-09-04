import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import type { Department } from "./types";
import { Button } from "../../components/Button";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (dept: Omit<Department, "id" | "members">) => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAddDepartment,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [leadManager, setLeadManager] = useState("");
  const [stationLocation, setStationLocation] = useState("Station 1 - Central Hub");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !leadManager) return;

    onAddDepartment({
      name,
      code: code.toUpperCase(),
      description,
      leadManager,
      leadManagerAvatar: "/images/chris.jpg",
      memberCount: 0,
      activeShifts: 0,
      stationLocation,
      budgetStatus: "On Target",
      iconName: "Truck",
      colorScheme: "red",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Department</h2>
              <p className="text-xs text-gray-400">Establish a new operational branch or team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Department Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Commercial Relocations"
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Code *
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CR"
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 uppercase focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Lead Manager / Supervisor *
            </label>
            <input
              type="text"
              required
              value={leadManager}
              onChange={(e) => setLeadManager(e.target.value)}
              placeholder="e.g. Marcus Vance"
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Station Location
            </label>
            <input
              type="text"
              value={stationLocation}
              onChange={(e) => setStationLocation(e.target.value)}
              placeholder="Station 1 - Central Hub"
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the department responsibilities and operational scope..."
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit">
              Create Department
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
