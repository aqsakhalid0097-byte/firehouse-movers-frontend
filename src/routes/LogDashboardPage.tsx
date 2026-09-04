'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Plus, Search, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, History } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ProfileSidebar } from "../features/profile/ProfileSidebar";
import { LogStatsOverview } from "../features/communication/LogStatsOverview";
import { LogTimelineList } from "../features/communication/LogTimelineList";
import { CreateLogModal } from "../features/communication/CreateLogModal";
import { useCommunicationDashboard } from "../api/staffPortalApi";

export const LogDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<'my_logs' | 'employee_logs'>('my_logs');
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useCommunicationDashboard({
    page: currentPage,
    view: activeView,
  });

  const logsList = data?.results || [];
  const isManager = data?.is_manager || false;
  const canCreateLog = data?.can_create_log || false;
  const numPages = data?.num_pages || 1;

  const filteredLogs = logsList.filter((log) => {
    const q = searchQuery.toLowerCase();
    const subjectMatch = log.subject?.toLowerCase().includes(q);
    const employeeMatch = log.employee?.full_name?.toLowerCase().includes(q);
    const authorMatch = log.created_by?.full_name?.toLowerCase().includes(q);
    const typeMatch = log.log_type?.name?.toLowerCase().includes(q);
    return subjectMatch || employeeMatch || authorMatch || typeMatch;
  });

  const stats = data?.stats || {
    total: logsList.length,
    unacknowledged: logsList.filter((l) => !l.is_acknowledged).length,
    acknowledged: logsList.filter((l) => l.is_acknowledged).length,
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        <ProfileSidebar activeTab="logs" />

        <main className="flex-1 min-w-0 bg-black px-4 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="animate-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Communication Logs & Notices
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Centralized incident notes, vehicle inspections, route remarks, and staff sign-offs
                </p>
              </div>

              {canCreateLog && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer select-none shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Log</span>
                </button>
              )}
            </div>

            {/* Quick Stats Overview */}
            <LogStatsOverview stats={stats} />

            {/* View Switcher (for managers) & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-neutral-800">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs by subject, staff name, or type..."
                  className="w-full bg-[#262626] border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {isManager && (
                <div className="flex items-center gap-2 bg-[#262626] p-1 rounded-lg border border-neutral-700">
                  <button
                    onClick={() => { setActiveView('my_logs'); setCurrentPage(1); }}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      activeView === 'my_logs'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    My Logs
                  </button>
                  <button
                    onClick={() => { setActiveView('employee_logs'); setCurrentPage(1); }}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      activeView === 'employee_logs'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Team Logs
                  </button>
                </div>
              )}
            </div>

            {/* Logs List Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading communication logs...</p>
              </div>
            ) : error ? (
              <div className="bg-red-950/30 border border-red-500/40 rounded-lg p-8 text-center space-y-4 max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Unable to Load Communication Logs</h3>
                <p className="text-xs text-gray-300">
                  {(error as any)?.message || 'There was an issue connecting to the communication endpoint.'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-16 bg-[#181818] rounded-xl border border-[#2a2a2a]">
                <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-lg font-bold text-white">No logs found</p>
                <p className="text-xs text-gray-400 mt-1">
                  No communication or incident records found for this view.
                </p>
              </div>
            ) : (
              <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <History className="w-5 h-5 text-gray-400" />
                  <span>Recent Communications</span>
                </div>

                <LogTimelineList
                  logs={filteredLogs}
                  onSelectLog={(log) => router.push(`/communication/logs/${log.id}`)}
                />

                {/* Pagination Controls */}
                {numPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#2a2a2a]">
                    <button
                      disabled={!data?.has_previous || currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#262626] hover:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed text-white border border-[#333333] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-xs text-gray-400">
                      Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{numPages}</strong>
                    </span>
                    <button
                      disabled={!data?.has_next || currentPage >= numPages}
                      onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#262626] hover:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed text-white border border-[#333333] transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateLogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateLog={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      <footer className="border-t border-neutral-800 bg-[#0f0f0f] py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LogDashboardPage;
