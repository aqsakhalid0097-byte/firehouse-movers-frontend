import React from "react";
import type { StaffMember } from "./types";
import { Phone, Mail, ChevronRight, Award } from "lucide-react";
import { getMediaUrl } from "../../utils/media";

interface PeopleTableProps {
  people: StaffMember[];
  onSelectMember: (member: StaffMember) => void;
}

export const PeopleTable: React.FC<PeopleTableProps> = ({ people, onSelectMember }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#333333] bg-[#1a1a1a] shadow-2xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-[#262626] text-xs uppercase font-bold text-gray-400 border-b border-[#333333]">
          <tr>
            <th className="py-4 px-6">Employee</th>
            <th className="py-4 px-6">Role & Department</th>
            <th className="py-4 px-6">Contact</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Completed Moves</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333333]">
          {people.map((person) => (
            <tr
              key={person.id}
              onClick={() => onSelectMember(person)}
              className="hover:bg-[#262626]/60 cursor-pointer transition-colors"
            >
              <td className="py-4 px-6 flex items-center gap-3.5">
                <img
                  src={getMediaUrl(person.avatarUrl)}
                  alt={`${person.firstName} ${person.lastName}`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith("/images/user_icon.jpg")) {
                      target.src = "/images/user_icon.jpg";
                    }
                  }}
                  className="w-11 h-11 rounded-full object-cover border border-[#333333] shadow-sm bg-[#262626]"
                />
                <div>
                  <p className="font-bold text-white text-base hover:text-red-500 transition-colors">
                    {person.firstName} {person.lastName}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">ID: #{person.id.toString().padStart(4, "0")}</p>
                </div>
              </td>
              <td className="py-4 px-6">
                <p className="font-bold text-red-500">{person.role}</p>
                <p className="text-xs text-gray-400">{person.department}</p>
              </td>
              <td className="py-4 px-6 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{person.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{person.phone}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    person.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : person.status === "On Duty"
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      : person.status === "On Leave"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  {person.status}
                </span>
              </td>
              <td className="py-4 px-6 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>{person.completedMoves ?? 0} moves</span>
                </div>
                <p className="text-gray-400 mt-0.5">Rating: {person.rating ? `${person.rating} ★` : "5.0 ★"}</p>
              </td>
              <td className="py-4 px-6 text-right">
                <button
                  type="button"
                  className="text-red-500 hover:text-red-400 inline-flex items-center gap-1 text-xs font-bold cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
