'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { ProfileHeader, type ProfileData } from '../features/profile/ProfileHeader';
import { ProfileInfoForm, type ProfileSaveData } from '../features/profile/ProfileInfoForm';
import { ProfileSecurity } from '../features/profile/ProfileSecurity';
import { ProfileTeamSection } from '../features/profile/ProfileTeamSection';
import { useProfile, useUpdateProfile } from '../api/staffPortalApi';
import { getMediaUrl } from '../utils/media';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams<{ userId?: string }>();
  const userId = params?.userId;
  const [activeTab, setActiveTab] = useState('profile');

  const { data: profileResponse, isLoading, error, refetch } = useProfile(userId);
  const updateProfileMutation = useUpdateProfile();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isOwnProfile = profileResponse ? profileResponse.is_own_profile : (!userId || String(user?.id) === String(userId));

  // Construct UI profile object from API response or fallback to Auth user
  const profileData: ProfileData = {
    id: profileResponse?.user?.id ?? profileResponse?.profile?.id ?? user?.id ?? 1,
    firstName: profileResponse?.user?.first_name ?? user?.first_name ?? '',
    lastName: profileResponse?.user?.last_name ?? user?.last_name ?? '',
    email: profileResponse?.user?.email ?? user?.email ?? '',
    phone: profileResponse?.profile?.phone_number || 'Not Set',
    location: profileResponse?.profile?.location || 'Lewisville, TX',
    role: profileResponse?.profile?.role_display || profileResponse?.profile?.role || (typeof user?.role === 'object' ? user.role.name || 'Driver' : user?.role || 'driver'),
    jobTitle: profileResponse?.profile?.job_title || 'Commercial Driver',
    startDate: profileResponse?.profile?.start_date || 'Aug 2024',
    tenure: profileResponse?.profile?.tenure,
    hobbies: profileResponse?.profile?.hobbies,
    favouriteQuote: profileResponse?.profile?.favourite_quote,
    avatarUrl: getMediaUrl(profileResponse?.profile?.profile_picture || user?.profile_picture),
    isOwnProfile,
  };

  const handleSaveProfile = async (updatedData: ProfileSaveData) => {
    await updateProfileMutation.mutateAsync({
      first_name: updatedData.firstName,
      last_name: updatedData.lastName,
      phone_number: updatedData.phone,
      location: updatedData.location,
      job_title: updatedData.jobTitle,
      hobbies: updatedData.hobbies,
      favourite_quote: updatedData.favouriteQuote,
      profile_picture: updatedData.profilePictureFile,
    });
  };

  const scrollToEdit = () => {
    const el = document.getElementById('profile-edit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTeam = () => {
    const el = document.getElementById('profile-team');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectMember = (targetUserId: number | string) => {
    router.push(`/profile/${targetUserId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={handleLogout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        <ProfileSidebar activeTab={activeTab} onTabSelect={setActiveTab} />

        <main className="flex-1 p-6 lg:p-10 space-y-10 min-w-0 bg-black">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading employee profile...</p>
            </div>
          ) : error && !user ? (
            <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">Unable to Load Profile</h3>
              <p className="text-xs text-gray-300">
                {(error as any)?.message || 'There was an issue connecting to the profile endpoint.'}
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : (
            <>
              {!isOwnProfile && (
                <div className="bg-[#1f1f1f] border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Viewing employee profile for <strong className="text-white">{profileData.firstName} {profileData.lastName}</strong>
                  </span>
                  <button
                    onClick={() => router.push('/profile')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                  >
                    Back to My Profile
                  </button>
                </div>
              )}

              <ProfileHeader
                profile={profileData}
                onEditClick={scrollToEdit}
                onViewManagerClick={scrollToTeam}
              />

              {isOwnProfile && (
                <ProfileInfoForm initialData={profileData} onSave={handleSaveProfile} />
              )}

              {isOwnProfile && (
                <ProfileSecurity email={profileData.email} />
              )}

              <ProfileTeamSection
                department={profileResponse?.profile?.department_title || 'Operations & Dispatch'}
                manager={
                  profileResponse?.manager
                    ? {
                        id: profileResponse.manager.id,
                        userId: profileResponse.manager.user_id,
                        name: profileResponse.manager.full_name,
                        role: profileResponse.manager.role_display || profileResponse.manager.role,
                        jobTitle: profileResponse.manager.job_title,
                        avatarUrl: profileResponse.manager.profile_picture || undefined,
                      }
                    : null
                }
                teammates={(profileResponse?.teammates || []).map((t) => ({
                  id: t.id,
                  userId: t.user_id,
                  name: t.full_name,
                  role: t.role_display || t.role,
                  jobTitle: t.job_title,
                  avatarUrl: t.profile_picture || undefined,
                }))}
                teamMembers={(profileResponse?.team_members || []).map((m) => ({
                  id: m.id,
                  userId: m.user_id,
                  name: m.full_name,
                  role: m.role_display || m.role,
                  jobTitle: m.job_title,
                  avatarUrl: m.profile_picture || undefined,
                }))}
                onSelectMember={handleSelectMember}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

