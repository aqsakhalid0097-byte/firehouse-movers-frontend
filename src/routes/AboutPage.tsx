'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { SmoothScrollProvider } from '../features/landing/SmoothScrollProvider';
import { AboutHero } from '../features/about/AboutHero';
import { AboutSectionNav } from '../features/about/AboutSectionNav';
import { AboutRoadTrackSection } from '../features/about/AboutRoadTrackSection';
import { AboutFleetPartnersSection } from '../features/about/AboutFleetPartnersSection';
import { MvpPartnersMarquee } from '../features/landing/MvpPartnersMarquee';
import { MvpScrollDriven3DTruck } from '../features/landing/MvpScrollDriven3DTruck';
import { AboutTimeline } from '../features/about/AboutTimeline';
import { AboutJoinTeamCta } from '../features/about/AboutJoinTeamCta';
import { LandingFooter } from '../features/landing/LandingFooter';
import { MvpBackToTop } from '../features/landing/MvpBackToTop';

/**
 * About Page:
 * 1. Dossier Header & Section Navigation
 * 2. Hamza Ka Track (Inverted motion: text comes towards the screen)
 * 3. Fleet Partner Section from Client (Ford Pro & 4 Alarm Restoration)
 * 4. Corporate Partners Infinite Marquee Strip
 * 5. Interactive 3D Truck Model with scroll rotation & 360° orbit inspection
 * 6. Heritage Timeline & Career CTA
 */
export const AboutPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <SmoothScrollProvider>
      <div
        data-about-root
        className="min-h-screen bg-black text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white"
      >
        {/* Navigation Header */}
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

        {/* Dossier Header */}
        <AboutHero />

        {/* Sticky Read Progress Rail */}
        <AboutSectionNav />

        <main>
          {/* 1. Hamza's Road Track with text emerging forward towards the screen */}
          <AboutRoadTrackSection />

          {/* 2. Client Fleet Partners: Ford Pro & 4 Alarm Restoration */}
          <AboutFleetPartnersSection />

          {/* 3. Corporate Partners Logo Strip */}
          <div className="py-6 border-y border-neutral-800 bg-neutral-950/60">
            <MvpPartnersMarquee />
          </div>

          {/* 4. Interactive 3D Truck Model (180° scroll rotation + 360° orbit) */}
          <MvpScrollDriven3DTruck />

          {/* 5. Station Heritage Timeline */}
          <AboutTimeline />

          {/* 6. Recruitment & Contact CTA */}
          <AboutJoinTeamCta />
        </main>

        {/* Footer & Back To Top */}
        <LandingFooter />
        <MvpBackToTop />
      </div>
    </SmoothScrollProvider>
  );
};

export default AboutPage;
