import React from "react";
import type { GoalItem } from "../../api/types";
import { Badge } from "../../components/Badge";
import { Calendar, User, ShieldCheck } from "lucide-react";

interface GoalProgressCardProps {
  goal: GoalItem;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal }) => {
  const isCompleted = goal.is_completed;
  const isShortTerm = goal.goal_type === "short_term";

  return (
    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all space-y-5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#262626] text-gray-300">
              {goal.goal_type_display || (isShortTerm ? "Short-Term" : "Long-Term")}
            </span>
            <Badge variant={isCompleted ? "success" : "warning"} size="sm">
              {isCompleted ? "Completed" : "Pending"}
            </Badge>
          </div>

          {goal.due_date && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-4 h-4 text-red-400 shrink-0" />
              <span>Due: {goal.due_date}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-white">{goal.title}</h3>

        {goal.description && (
          <p className="text-xs text-gray-300 leading-relaxed">
            {goal.description}
          </p>
        )}
      </div>

      {/* Status Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-400">Status</span>
          <span className={isCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {isCompleted ? "100% Achieved" : "In Progress"}
          </span>
        </div>
        <div className="w-full bg-[#262626] rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 w-full"
                : "bg-gradient-to-r from-red-600 to-orange-500 w-1/2"
            }`}
          />
        </div>
      </div>

      {goal.notes && (
        <p className="text-xs text-gray-400 bg-[#262626]/40 p-3 rounded-xl border border-neutral-800/80">
          <strong className="text-gray-300 font-semibold block mb-0.5">Notes:</strong>
          {goal.notes}
        </p>
      )}

      {/* Footer Info: Assigned To / Created By */}
      <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
        {goal.assigned_to?.full_name && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <span>Assigned: <strong className="text-gray-300">{goal.assigned_to.full_name}</strong></span>
          </div>
        )}
        {goal.created_by?.full_name && (
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Set by {goal.created_by.full_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
