import React from "react";
import { Truck, Users, ChevronRight, ShieldCheck, HeartHandshake } from "lucide-react";
import type { DepartmentItem } from "../../api/types";
import { Badge } from "../../components/Badge";

interface DepartmentGridProps {
  departments: DepartmentItem[];
  onSelectDepartment: (dept: DepartmentItem) => void;
}

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({
  departments,
  onSelectDepartment,
}) => {
  const getIcon = (slug?: string) => {
    if (!slug) return <Truck className="w-5 h-5 text-red-400" />;
    const s = slug.toLowerCase();
    if (s.includes('driver') || s.includes('fleet') || s.includes('transport')) {
      return <Truck className="w-5 h-5 text-red-400" />;
    }
    if (s.includes('safety') || s.includes('dispatch') || s.includes('ops')) {
      return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
    return <HeartHandshake className="w-5 h-5 text-pink-400" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => {
        const memberCount = dept.employee_count ?? dept.members?.length ?? 0;
        const managerName = dept.manager?.full_name || "Unassigned";
        const managerTitle = dept.manager?.job_title || "Department Lead";

        return (
          <div
            key={dept.id}
            onClick={() => onSelectDepartment(dept)}
            className="bg-[#1a1a1a] border border-neutral-800 hover:border-red-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-red-950/20 group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#262626] border border-neutral-700 group-hover:border-red-500/50 transition-colors">
                  {getIcon(dept.slug)}
                </div>
                {dept.is_manager ? (
                  <Badge variant="danger" size="sm">Manager</Badge>
                ) : dept.is_member ? (
                  <Badge variant="info" size="sm">Your Dept</Badge>
                ) : (
                  <Badge variant="default" size="sm">Active</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                  {dept.title}
                </h3>
                {dept.slug && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-gray-400 uppercase">
                    {dept.slug}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                {dept.description || "Firehouse Movers divisional operational group."}
              </p>

              <div className="space-y-2.5 text-xs text-gray-300 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Department Lead:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{managerName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-gray-300">{managerTitle}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>View Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
