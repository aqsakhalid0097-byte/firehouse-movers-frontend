'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Eye,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { useGoals, useMyGoals } from '../api/staffPortalApi';
import type { GoalEmployeeSummary, GoalItem } from '../api/types';

export const GoalsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();

  // Role detection matching Django base.html
  const roleName = (
    typeof user?.role === 'object' && user?.role !== null
      ? user.role.name || ''
      : typeof user?.role === 'string'
      ? user.role
      : ''
  ).toLowerCase();

  const isManager =
    roleName === 'manager' ||
    roleName === 'admin' ||
    roleName === 'ceo' ||
    roleName === 'vp' ||
    roleName === 'llc/owner' ||
    Boolean(typeof user?.role === 'object' && user?.role !== null && (user.role.is_manager || user.role.is_admin || user.role.is_senior_management));

  const isSeniorManagement =
    roleName === 'ceo' ||
    roleName === 'vp' ||
    roleName === 'admin' ||
    Boolean(typeof user?.role === 'object' && user?.role !== null && user.role.is_senior_management);

  // Tab mode: "management" (Employee Goals) vs "my_goals" (Personal Goals)
  const tabParam = searchParams.get('tab');
  const [activeTabMode, setActiveTabMode] = useState<'management' | 'my_goals'>(
    tabParam === 'my_goals' || !isManager ? 'my_goals' : 'management'
  );

  useEffect(() => {
    if (tabParam === 'my_goals') {
      setActiveTabMode('my_goals');
    } else if (isManager && !tabParam) {
      setActiveTabMode('management');
    }
  }, [tabParam, isManager]);

  // Filters state
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [myGoalTypeFilter, setMyGoalTypeFilter] = useState<string>('all');
  const [myGoalStatusFilter, setMyGoalStatusFilter] = useState<string>('all');

  // Selected modals
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<GoalEmployeeSummary | null>(null);
  const [selectedEmployeeForAdd, setSelectedEmployeeForAdd] = useState<GoalEmployeeSummary | null>(null);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Queries
  const {
    data: goalsData,
    isLoading: isGoalsLoading,
    error: goalsError,
    refetch: refetchGoals,
  } = useGoals({
    role: roleFilter !== 'all' ? roleFilter : undefined,
    scope: scopeFilter !== 'all' ? scopeFilter : undefined,
  });

  const {
    data: myGoalsData,
    isLoading: isMyGoalsLoading,
    error: myGoalsError,
    refetch: refetchMyGoals,
  } = useMyGoals({
    goal_type: myGoalTypeFilter !== 'all' ? myGoalTypeFilter : undefined,
    completion_status: myGoalStatusFilter !== 'all' ? myGoalStatusFilter : undefined,
  });

  const employees = goalsData?.employees || [];
  const allManagementGoals = goalsData?.goals || [];
  const myGoalsList = myGoalsData?.goals || [];
  const myStats = myGoalsData?.stats || {
    total_goals: myGoalsList.length,
    completed_goals: myGoalsList.filter((g) => g.is_completed).length,
    pending_goals: myGoalsList.filter((g) => !g.is_completed).length,
    goal_completion_percentage:
      myGoalsList.length > 0
        ? Math.round((myGoalsList.filter((g) => g.is_completed).length / myGoalsList.length) * 100)
        : 0,
  };

  const selectedEmployeeGoals = selectedEmployeeForView
    ? allManagementGoals.filter((g) => g.assigned_to?.id === selectedEmployeeForView.user_id)
    : [];

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        {/* Left Profile Sidebar */}
        <ProfileSidebar activeTab={activeTabMode === 'management' ? 'goals' : 'my_goals'} />

        {/* Main Content matching goals/templates/goals/goal_management.html */}
        <main className="flex-1 min-w-0 bg-black pt-4 px-6 sm:px-10 pb-10 text-white" data-tour-main>
          <div className="max-w-7xl mx-auto">
            {/* View Mode Toggle Header if Manager */}
            {isManager && (
              <div className="flex gap-3 mb-6 border-b border-[#262626] pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('management')}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                    activeTabMode === 'management'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-[#222222] text-gray-400 hover:text-white'
                  }`}
                >
                  Employee Goals (Management)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabMode('my_goals')}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                    activeTabMode === 'my_goals'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-[#222222] text-gray-400 hover:text-white'
                  }`}
                >
                  My Personal Goals
                </button>
              </div>
            )}

            {/* =========================================================================
             * VIEW 1: EMPLOYEE GOALS MANAGEMENT (goal_management.html)
             * ========================================================================= */}
            {activeTabMode === 'management' && (
              <div>
                <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Employee Goals</h1>

                {/* Filter Form matching Django template */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    refetchGoals();
                  }}
                  className="mb-8 flex items-center gap-3 flex-wrap"
                >
                  <label htmlFor="role_select" className="text-white font-semibold text-sm">
                    Filter by Role:
                  </label>
                  <select
                    id="role_select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md text-white py-2 px-3 focus:outline-none focus:border-red-500 text-sm cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="crew_leader">Crew Leader</option>
                    <option value="driver">Driver</option>
                    <option value="lead_mover">Lead Mover</option>
                    <option value="mover">Mover</option>
                  </select>

                  {isSeniorManagement && (
                    <>
                      <label htmlFor="scope_select" className="text-white font-semibold ml-4 text-sm">
                        Scope:
                      </label>
                      <select
                        id="scope_select"
                        value={scopeFilter}
                        onChange={(e) => setScopeFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-md text-white py-2 px-3 focus:outline-none focus:border-red-500 text-sm cursor-pointer"
                      >
                        <option value="all">All Company</option>
                        <option value="team">My Direct Team</option>
                      </select>
                    </>
                  )}
                </form>

                {isGoalsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading employee goals...</p>
                  </div>
                ) : goalsError ? (
                  <div className="bg-[#2a2a2a] border border-red-800/80 rounded-lg p-6 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <p className="text-red-300 font-semibold text-sm">Failed to load employee goals</p>
                    <button
                      type="button"
                      onClick={() => refetchGoals()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : employees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg border border-[#333333] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-bold text-white truncate">
                              {emp.display_name}
                            </h2>
                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeForView(emp)}
                              title="View Employee Goals"
                              className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>

                          <p className="text-gray-400 text-sm mb-4">
                            Role: <span className="text-white font-medium">{emp.role_display}</span>
                          </p>

                          <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#333333] mb-4 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Goals Assigned:</span>
                            <span className="text-sm font-bold text-red-400">
                              {emp.goal_count_summary || `${emp.goal_count || 0}/3 Goals`}
                            </span>
                          </div>
                        </div>

                        <div>
                          {emp.can_add_more_goals ? (
                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeForAdd(emp)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Assign Goal</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="w-full bg-gray-700 text-gray-400 font-semibold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
                            >
                              Max 3 Goals Reached
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No employees found for this filter.</p>
                )}
              </div>
            )}

            {/* =========================================================================
             * VIEW 2: MY GOALS (my_goals.html)
             * ========================================================================= */}
            {activeTabMode === 'my_goals' && (
              <div>
                <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">My Goals</h1>

                {/* Stats Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#2a2a2a] p-4 rounded-xl border border-[#333333]">
                    <span className="text-xs text-gray-400 font-semibold uppercase">Total Goals</span>
                    <p className="text-2xl font-bold text-white mt-1">{myStats.total_goals}</p>
                  </div>
                  <div className="bg-[#2a2a2a] p-4 rounded-xl border border-[#333333]">
                    <span className="text-xs text-gray-400 font-semibold uppercase">Completed</span>
                    <p className="text-2xl font-bold text-green-400 mt-1">{myStats.completed_goals}</p>
                  </div>
                  <div className="bg-[#2a2a2a] p-4 rounded-xl border border-[#333333]">
                    <span className="text-xs text-gray-400 font-semibold uppercase">Completion Rate</span>
                    <p className="text-2xl font-bold text-red-400 mt-1">
                      {myStats.goal_completion_percentage}%
                    </p>
                  </div>
                </div>

                {/* Filters Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    refetchMyGoals();
                  }}
                  className="mb-8 flex items-center gap-4 flex-wrap"
                >
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Goal Type</label>
                    <select
                      value={myGoalTypeFilter}
                      onChange={(e) => setMyGoalTypeFilter(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded text-white py-1.5 px-3 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="short_term">Short-Term</option>
                      <option value="long_term">Long-Term</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Status</label>
                    <select
                      value={myGoalStatusFilter}
                      onChange={(e) => setMyGoalStatusFilter(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded text-white py-1.5 px-3 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </form>

                {isMyGoalsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading your goals...</p>
                  </div>
                ) : myGoalsError ? (
                  <div className="bg-[#2a2a2a] border border-red-800/80 rounded-lg p-6 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <p className="text-red-300 font-semibold text-sm">Failed to load personal goals</p>
                    <button
                      type="button"
                      onClick={() => refetchMyGoals()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : myGoalsList.length > 0 ? (
                  <div className="space-y-4">
                    {myGoalsList.map((goal: GoalItem) => (
                      <div
                        key={goal.id}
                        className={`p-5 rounded-xl border transition-all ${
                          goal.is_completed
                            ? 'bg-[#1e1e1e]/60 border-green-800/50'
                            : 'bg-[#222222] border-[#333333]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  goal.goal_type === 'short_term'
                                    ? 'bg-blue-600/30 text-blue-400 border border-blue-600/40'
                                    : 'bg-purple-600/30 text-purple-400 border border-purple-600/40'
                                }`}
                              >
                                {goal.goal_type_display || (goal.goal_type === 'short_term' ? 'Short-Term' : 'Long-Term')}
                              </span>
                              {goal.is_completed && (
                                <span className="bg-green-600/20 text-green-400 border border-green-600/40 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Completed
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-white mt-2">{goal.title}</h3>
                            <p className="text-gray-300 text-sm mt-1 leading-relaxed">{goal.description}</p>
                            {goal.notes && (
                              <p className="text-gray-400 text-xs italic mt-2 border-l-2 border-red-500 pl-3">
                                Notes: {goal.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No goals assigned to your profile yet.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Employee Goals Modal */}
      {selectedEmployeeForView && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl max-w-lg w-full text-white border border-gray-700 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div>
                <h2 className="text-xl font-bold text-red-500">
                  {selectedEmployeeForView.display_name}
                </h2>
                <p className="text-xs text-gray-400">{selectedEmployeeForView.role_display}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmployeeForView(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedEmployeeGoals.length > 0 ? (
                selectedEmployeeGoals.map((goal: GoalItem) => (
                  <div
                    key={goal.id}
                    className="bg-[#262626] p-4 rounded-xl border border-[#333333] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                        {goal.goal_type_display || (goal.goal_type === 'short_term' ? 'Short-Term' : 'Long-Term')}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          goal.is_completed ? 'bg-green-600/30 text-green-400' : 'bg-yellow-600/30 text-yellow-400'
                        }`}
                      >
                        {goal.is_completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm">{goal.title}</h4>
                    <p className="text-gray-300 text-xs">{goal.description}</p>
                    {goal.notes && (
                      <p className="text-gray-400 text-xs italic">Notes: {goal.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs italic">No goals assigned yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#333333]">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForView(null)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Goal Modal */}
      {selectedEmployeeForAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl max-w-md w-full text-white border border-gray-700 space-y-4">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h2 className="text-xl font-bold text-red-500">
                Assign Goal to {selectedEmployeeForAdd.display_name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedEmployeeForAdd(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Goal assigned to ${selectedEmployeeForAdd.display_name}!`);
                setSelectedEmployeeForAdd(null);
                refetchGoals();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white font-medium text-xs mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Hydraulic Ramp Staging"
                  className="bg-[#262626] border border-[#333333] text-white rounded-md px-3 py-2 text-xs w-full focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium text-xs mb-1">Goal Type</label>
                <select className="bg-[#262626] border border-[#333333] text-white rounded-md px-3 py-2 text-xs w-full focus:border-red-500 focus:outline-none">
                  <option value="short_term">Short-Term (1-3 months)</option>
                  <option value="long_term">Long-Term (6-12 months)</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium text-xs mb-1">Description & Criteria</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specific measurable criteria for goal completion..."
                  className="bg-[#262626] border border-[#333333] text-white rounded-md px-3 py-2 text-xs w-full focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#333333]">
                <button
                  type="button"
                  onClick={() => setSelectedEmployeeForAdd(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-xs cursor-pointer"
                >
                  Save & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
