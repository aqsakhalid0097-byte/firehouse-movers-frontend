import React, { useState } from "react";
import { X, UserPlus, Mail, Phone } from "lucide-react";
import type { StaffMember, StaffRole, StaffStatus } from "./types";
import { Button } from "../../components/Button";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<StaffMember, "id">) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("Mover");
  const [department, setDepartment] = useState("Moving Operations");
  const [status, setStatus] = useState<StaffStatus>("Active");
  const [driverLicense, setDriverLicense] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRel, setEmergencyRel] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    onAddMember({
      firstName,
      lastName,
      email,
      phone: phone || "(214) 555-0100",
      role,
      department,
      status,
      hireDate: new Date().toISOString().split("T")[0],
      completedMoves: 0,
      rating: 5.0,
      driverLicense: driverLicense || undefined,
      emergencyContact: emergencyName
        ? {
            name: emergencyName,
            phone: emergencyPhone || "(214) 555-0101",
            relationship: emergencyRel || "Family",
          }
        : undefined,
      avatarUrl: "/images/user_icon.jpg",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-[#333333] bg-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Add Team Member</h2>
              <p className="text-xs text-gray-400">Register and onboard a staff member to the company directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#333333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@firehousemovers.com"
                  className="w-full bg-[#262626] border border-[#333333] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(214) 555-0199"
                  className="w-full bg-[#262626] border border-[#333333] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Mover">Mover</option>
                <option value="Driver">Driver</option>
                <option value="Crew Lead">Crew Lead</option>
                <option value="Dispatch Coordinator">Dispatch Coordinator</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Branch Manager">Branch Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Moving Operations">Moving Operations</option>
                <option value="Fleet & Transport">Fleet & Transport</option>
                <option value="Dispatch & Logistics">Dispatch & Logistics</option>
                <option value="Fleet & Safety">Fleet & Safety</option>
                <option value="Management">Management</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StaffStatus)}
                className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Active">Active</option>
                <option value="On Duty">On Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
              Driver License Number (Optional)
            </label>
            <input
              type="text"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
              placeholder="TX-CDL-1234567"
              className="w-full bg-[#262626] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="p-5 rounded-xl bg-[#262626] border border-[#333333] space-y-3">
            <h4 className="text-xs font-bold uppercase text-red-500 tracking-wider">
              Emergency Contact (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Contact Name"
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                value={emergencyRel}
                onChange={(e) => setEmergencyRel(e.target.value)}
                placeholder="Relationship (e.g. Spouse)"
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Contact Phone"
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#333333]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#333333] transition-colors"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit">
              Save & Add Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
