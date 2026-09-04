'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { AuthLandingHero } from '../features/authenticatedLanding/AuthLandingHero';
import { AuthLandingServicesGrid } from '../features/authenticatedLanding/AuthLandingServicesGrid';

export const AuthenticatedLandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.first_name || 'Mohid';

  return (
    <div className="min-h-screen bg-[#141414] text-gray-100 font-sans antialiased">
      <Navbar
        isAuthenticated={true}
        user={user}
        onLogout={handleLogout}
        notificationCount={3}
      />

      <main className="pb-20">
        <AuthLandingHero userName={displayName} />
        <AuthLandingServicesGrid />
      </main>

      <footer className="border-t border-neutral-800 bg-[#0f0f0f] py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-gray-400">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            <a href="#support" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedLandingPage;
