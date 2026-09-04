'use client';

import React, { useState } from 'react';
import { Eye, Edit2, Trash2, X, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { AddDepartmentModal } from '../features/department/AddDepartmentModal';
import { useDepartments } from '../api/staffPortalApi';
import type { DepartmentItem } from '../api/types';

export const DepartmentPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: departmentsData, isLoading, error, refetch } = useDepartments();

  const [selectedInfoDept, setSelectedInfoDept] = useState<DepartmentItem | null>(null);
  const [deletingDept, setDeletingDept] = useState<DepartmentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const canManage = departmentsData?.can_manage || false;
  const departments = departmentsData?.departments || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Navbar */}
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        {/* Profile Sidebar */}
        <ProfileSidebar activeTab="department" />

        {/* Main Content matching authentication/templates/authentication/department.html */}
        <main className="flex-1 min-w-0 bg-black p-6 sm:p-10" data-tour-main>
          <div className="max-w-7xl mx-auto">
            {/* Title matching Django template */}
            <h1 className="animate-heading text-3xl font-bold text-red-500 mb-8">List of Departments</h1>

            {/* + Add Department button */}
            {canManage && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-red-500 hover:bg-red-700 px-5 py-2.5 rounded-md text-white font-semibold mb-6 inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Department</span>
              </button>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading departments...</p>
              </div>
            ) : error ? (
              <div className="bg-[#2a2a2a] border border-red-800/80 rounded-lg p-6 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-red-300 font-semibold text-sm">Failed to load departments</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : departments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex flex-col min-h-[260px] hover:scale-[1.02] transition relative border border-[#333333] justify-between"
                  >
                    <div>
                      {/* Department Name */}
                      <h2 className="text-2xl font-bold text-red-500 mb-4 truncate pr-8">
                        {dept.title}
                      </h2>

                      {/* Eye Icon Modal Trigger in top right */}
                      <button
                        type="button"
                        onClick={() => setSelectedInfoDept(dept)}
                        title="View Details"
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Manager Section */}
                      <div className="mb-4">
                        <h3 className="text-sm font-bold text-white mb-1">Manager</h3>
                        <p className="text-gray-400 text-sm">
                          {dept.manager?.full_name ? (
                            <span className="text-white hover:underline cursor-pointer">
                              {dept.manager.full_name}
                            </span>
                          ) : (
                            <span className="italic">Not Assigned</span>
                          )}
                        </p>
                      </div>

                      {/* Employees Section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-white mb-1">Employees</h3>
                        <p className="text-gray-400 text-sm">{dept.employee_count}</p>
                      </div>
                    </div>

                    {/* Bottom Status / Actions */}
                    <div>
                      {/* Manager/Employee Indicator Badge */}
                      {dept.is_manager ? (
                        <div className="text-center mb-3">
                          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap inline-block font-medium">
                            You manage this department
                          </span>
                        </div>
                      ) : dept.is_member ? (
                        <div className="text-center mb-3">
                          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap inline-block font-medium">
                            You belong to this department
                          </span>
                        </div>
                      ) : null}

                      {/* Action Buttons for Admins & Managers */}
                      {canManage && (
                        <div className="flex justify-end gap-3 pt-3 border-t border-[#3a3a3a]">
                          <button
                            type="button"
                            onClick={() => setSelectedInfoDept(dept)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingDept(dept)}
                            className="text-sm bg-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic mt-4">No departments added yet.</p>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal matching Django department.html */}
      {deletingDept && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl max-w-md w-full text-white border border-[#333333] space-y-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete the department <strong>"{deletingDept.title}"</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeletingDept(null)}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setDeletingDept(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Info Modal matching Django department.html */}
      {selectedInfoDept && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl max-w-md w-full text-white border border-gray-700 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h2 className="text-2xl font-bold text-red-500 truncate">
                {selectedInfoDept.title}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedInfoDept(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-white font-semibold mb-1 text-sm">Description:</p>
              <p className="text-gray-400 text-xs leading-relaxed">{selectedInfoDept.description || 'No description provided.'}</p>
            </div>

            <div>
              <p className="text-white font-semibold mb-1 text-sm">Manager:</p>
              <p className="text-gray-400 text-xs">{selectedInfoDept.manager?.full_name || 'Not Assigned'}</p>
            </div>

            <div>
              <p className="text-white font-semibold mb-1 text-sm">
                Employees ({selectedInfoDept.members?.length || 0}):
              </p>
              <ul className="ml-6 list-disc marker:text-red-500 text-gray-300 text-xs space-y-1 max-h-40 overflow-y-auto">
                {(selectedInfoDept.members || []).map((emp, i) => (
                  <li key={i}>{emp.full_name} ({emp.job_title || 'Staff'})</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#333333]">
              <button
                type="button"
                onClick={() => setSelectedInfoDept(null)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDepartment={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};

export default DepartmentPage;
