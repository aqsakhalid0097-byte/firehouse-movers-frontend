'use client';

import React, { useState } from "react";
import { Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ProfileSidebar } from "../features/profile/ProfileSidebar";
import { PeopleGrid } from "../features/people/PeopleGrid";
import { MemberDetailModal } from "../features/people/MemberDetailModal";
import { usePeopleDirectory } from "../api/staffPortalApi";
import type { PeopleDirectoryMember } from "../api/types";

export const PeoplePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = usePeopleDirectory({ page: currentPage });
  const [selectedMember, setSelectedMember] = useState<PeopleDirectoryMember | null>(null);

  const peopleList = data?.results || [];
  const totalCount = data?.count ?? peopleList.length;
  const numPages = data?.num_pages || 1;

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} />

      <div className="flex min-h-[calc(100vh-80px)] bg-black">
        <ProfileSidebar activeTab="people" />

        <main className="flex-1 min-w-0 bg-black px-6 sm:px-10 lg:px-12 py-10 flex justify-center">
          <div className="max-w-[1280px] w-full space-y-6">
            {/* Title & Subtitle matching original Django project exactly */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="animate-heading text-3xl sm:text-4xl font-bold text-red-500 mb-1 tracking-tight">
                  People
                </h1>
                <p className="text-sm text-gray-400">
                  {totalCount > 0
                    ? `Showing ${peopleList.length} of ${totalCount} Firehouse Movers team members`
                    : "All employees of Firehouse Movers"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading staff directory...</p>
              </div>
            ) : error ? (
              <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Unable to Load Staff Directory</h3>
                <p className="text-xs text-gray-300">
                  {(error as any)?.message || 'There was an issue connecting to the people endpoint.'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : peopleList.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-12 text-center text-gray-400">
                <p className="text-base font-semibold text-white">No employees found.</p>
                <p className="text-xs mt-1">Staff roster will appear here once registered.</p>
              </div>
            ) : (
              <>
                {/* 5-Column Grid of People Cards */}
                <PeopleGrid
                  people={peopleList}
                  onSelectMember={(m) => setSelectedMember(m)}
                />

                {/* Pagination Controls */}
                {numPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-6">
                    <button
                      disabled={!data?.has_previous || currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#262626] hover:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed text-white border border-[#333333] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-xs text-gray-400">
                      Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{numPages}</strong>
                    </span>
                    <button
                      disabled={!data?.has_next || currentPage >= numPages}
                      onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#262626] hover:bg-[#333333] disabled:opacity-40 disabled:cursor-not-allowed text-white border border-[#333333] transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};

export default PeoplePage;
