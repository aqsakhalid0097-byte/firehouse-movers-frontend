'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { MvpContactSection } from '../features/landing/MvpContactSection';
import { LandingFooter } from '../features/landing/LandingFooter';
import { MvpBackToTop } from '../features/landing/MvpBackToTop';

export const EstimateCalculatorPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-gray-100 font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      {/* Global Navigation Header */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {/* Main Full-Screen Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16">
        <MvpContactSection isStandalonePage={true} id="estimate-calculator" />
      </main>

      {/* Global Footer */}
      <LandingFooter />

      {/* Back To Top Floating Action */}
      <MvpBackToTop />
    </div>
  );
};

export default EstimateCalculatorPage;
