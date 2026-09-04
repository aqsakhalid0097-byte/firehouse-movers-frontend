import React from "react";
import type { CommunicationLogItem } from "../../api/types";
import {
  User,
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  ThumbsUp,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";

interface LogTimelineListProps {
  logs: CommunicationLogItem[];
  onSelectLog?: (log: CommunicationLogItem) => void;
}

export const LogTimelineList: React.FC<LogTimelineListProps> = ({ logs, onSelectLog }) => {
  const formatLongDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getLogTypeBadge = (name?: string) => {
    const n = name?.toLowerCase() || "";
    if (n.includes("positive") || n.includes("commend")) {
      return {
        className: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
        icon: <ThumbsUp className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes("safety") || n.includes("incident") || n.includes("concern")) {
      return {
        className: "bg-red-950/60 text-red-400 border-red-800/60",
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes("training") || n.includes("development")) {
      return {
        className: "bg-purple-950/60 text-purple-400 border-purple-800/60",
        icon: <GraduationCap className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes("performance") || n.includes("review")) {
      return {
        className: "bg-blue-950/60 text-sky-400 border-blue-800/60",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes("instruction") || n.includes("directive")) {
      return {
        className: "bg-indigo-950/60 text-indigo-400 border-indigo-800/60",
        icon: <FileText className="w-3.5 h-3.5" />,
      };
    }
    return {
      className: "bg-neutral-900 text-gray-300 border-neutral-700",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
    };
  };

  return (
    <div className="space-y-3" role="list">
      {logs.map((log) => {
        const badge = getLogTypeBadge(log.log_type?.name);
        const eventDateStr = formatLongDate(log.event_date || (log.created_at ? log.created_at.split("T")[0] : ""));
        const deadlineStr = log.acknowledgment_deadline ? formatShortDate(log.acknowledgment_deadline) : "";

        return (
          <div
            key={log.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectLog?.(log)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectLog?.(log);
              }
            }}
            className="bg-[#242424] border border-[#303030] hover:border-red-500/50 hover:bg-[#282828] rounded-lg p-4 sm:p-5 transition-all cursor-pointer group flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <div className="flex-1 min-w-0 space-y-2.5">
              {/* Top Row: Type Pill + Author & Employee */}
              <div className="flex items-center gap-3 flex-wrap">
                {log.log_type?.name && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border ${badge.className}`}
                  >
                    {badge.icon}
                    <span>{log.log_type.name}</span>
                  </span>
                )}

                {log.created_by?.full_name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>By: <strong className="text-gray-300 font-medium">{log.created_by.full_name}</strong></span>
                  </div>
                )}

                {log.employee?.full_name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 border-l border-neutral-700 pl-3">
                    <span>For: <strong className="text-gray-300 font-medium">{log.employee.full_name}</strong></span>
                  </div>
                )}
              </div>

              {/* Subject Title */}
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                {log.subject}
              </h3>

              {/* Bottom Row: Dates */}
              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>{eventDateStr}</span>
                </div>

                {deadlineStr && (
                  <div className={`flex items-center gap-1.5 ${log.deadline_overdue ? 'text-red-400 font-semibold' : ''}`}>
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Deadline: {deadlineStr} {log.deadline_overdue && '(Overdue)'}</span>
                  </div>
                )}

                {log.response_count > 0 && (
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>{log.response_count} response{log.response_count > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Status Badges & Chevron */}
            <div className="flex items-center gap-3 shrink-0">
              {log.has_unviewed_response && (
                <span className="bg-sky-950/70 border border-sky-700/60 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span>New Response</span>
                </span>
              )}
              {!log.is_acknowledged ? (
                <span className="bg-amber-950/70 border border-amber-700/60 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </span>
              ) : (
                <span className="bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md hidden sm:flex items-center gap-1.5">
                  <span>Acknowledged</span>
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
