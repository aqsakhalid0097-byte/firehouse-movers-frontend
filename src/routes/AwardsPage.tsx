'use client';

import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ProfileSidebar } from "../features/profile/ProfileSidebar";
import { AwardsColumn } from "../features/awards/AwardsColumn";
import { HallOfFameColumn } from "../features/awards/HallOfFameColumn";
import { useAwardsMe } from "../api/staffPortalApi";

export const AwardsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data, isLoading, isError, refetch } = useAwardsMe();

  const awardsList = data?.awards || [];
  const hallOfFameList = data?.hall_of_fame || [];

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased w-full">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} />

      <div className="flex min-h-[calc(100vh-80px)] bg-black w-full">
        <ProfileSidebar activeTab="awards" />

        <main className="flex-1 min-w-0 bg-black px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="w-full space-y-6">
            {/* Centered Page Title matching redesigned layout */}
            <h1 className="animate-heading text-2xl sm:text-3xl font-extrabold text-red-500 text-center tracking-tight">
              My Achievements
            </h1>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading achievements & Hall of Fame...</p>
              </div>
            ) : isError ? (
              <div className="max-w-xl mx-auto bg-red-950/40 border border-red-800/80 rounded-xl p-6 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-red-300 font-semibold text-sm">Failed to load awards & achievements</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : (
              /* Two Column Full-Width Layout: Awards (Left) & Hall of Fame (Right) */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
                <AwardsColumn awards={awardsList} />
                <HallOfFameColumn entries={hallOfFameList} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AwardsPage;

