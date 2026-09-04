'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { JourneyHero } from '../features/journey/JourneyHero';
import { MoveJourneyPinnedScroll } from '../features/journey/MoveJourneyPinnedScroll';
import { LandingCtaBanner } from '../features/landing/LandingCtaBanner';
import { LandingFooter } from '../features/landing/LandingFooter';

export const MoveJourneyPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main>
        {/* 1. Journey Introduction */}
        <JourneyHero />

        {/* 2. Pinned Scroll Progression Animation (Loaded -> On the Go -> Delivered) */}
        <MoveJourneyPinnedScroll />

        {/* 3. Call to Action Banner */}
        <LandingCtaBanner />
      </main>

      {/* 4. Footer */}
      <LandingFooter />
    </div>
  );
};

export default MoveJourneyPage;
