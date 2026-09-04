'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { AboutHero } from '../features/about/AboutHero';
import { AboutSectionNav } from '../features/about/AboutSectionNav';
import { MvpPreloader } from '../features/landing/MvpPreloader';
import { AboutAtAGlance } from '../features/about/AboutAtAGlance';
import { AboutStory } from '../features/about/AboutStory';
import { AboutTimeline } from '../features/about/AboutTimeline';
import { AboutValues } from '../features/about/AboutValues';
import { AboutStations } from '../features/about/AboutStations';
import { AboutCredentials } from '../features/about/AboutCredentials';
import { AboutJoinTeamCta } from '../features/about/AboutJoinTeamCta';
import { LandingFooter } from '../features/landing/LandingFooter';
import { MvpBackToTop } from '../features/landing/MvpBackToTop';

/**
 * About reads as a company dossier rather than a second landing page:
 * dense, scannable reference sections with navigation, filtering and
 * progressive disclosure instead of cinematic scroll effects.
 */
export const AboutPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div
      data-about-root
      className="min-h-screen bg-black text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white"
    >
      {/* 0. Agency-Grade Dispatch Preloader (only once at the start of visit) */}
      <MvpPreloader />

      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {/* Dossier header */}
      <AboutHero />

      {/* Sticky scroll-spy rail + read progress */}
      <AboutSectionNav />

      <main>
        <AboutAtAGlance />
        <AboutStory />
        <AboutTimeline />
        <AboutValues />
        <AboutStations />
        <AboutCredentials />
        <AboutJoinTeamCta />
      </main>

      <LandingFooter />
      <MvpBackToTop />
    </div>
  );
};

export default AboutPage;
