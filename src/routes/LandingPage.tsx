'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { SmoothScrollProvider } from '../features/landing/SmoothScrollProvider';
import { MvpPreloader } from '../features/landing/MvpPreloader';
import { MvpLandingHero } from '../features/landing/MvpLandingHero';
import { MvpPartnersMarquee } from '../features/landing/MvpPartnersMarquee';
import { MvpAboutSection } from '../features/landing/MvpAboutSection';
import { MvpScrollDriven3DTruck } from '../features/landing/MvpScrollDriven3DTruck';
import { MvpEditorialServices } from '../features/landing/MvpEditorialServices';
import { MoveJourneyPinnedScroll } from '../features/journey/MoveJourneyPinnedScroll';
import { MvpTextParallax } from '../features/landing/MvpTextParallax';
import { MvpContactSection } from '../features/landing/MvpContactSection';
import { LandingFooter } from '../features/landing/LandingFooter';
import { MvpBackToTop } from '../features/landing/MvpBackToTop';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <SmoothScrollProvider>
      {/* 0. Agency-Grade Dispatch Preloader */}
      <MvpPreloader />

      <div className="min-h-screen bg-black text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
        {/* 1. Luxury Glassmorphism Navbar */}
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

        <main>
          {/* 2. Hero: Master entrance + storytelling origin narrative + magnetic CTA */}
          <MvpLandingHero />

          {/* 3. Partners & Corporate Clients Infinite Marquee */}
          <MvpPartnersMarquee />

          {/* 4. About Section: Story, image mask zoom, and animated radial numeric gauges */}
          <MvpAboutSection />

          {/* 5. Scroll-Driven 3D Truck 180° Rotation & Operational Standards */}
          <MvpScrollDriven3DTruck />

          {/* 6. Comprehensive Service Directory: Exact reference 2-column showcase */}
          <MvpEditorialServices />

          {/* 7. Move Lifecycle Journey: Sinusoidal wavelength pinned scroll progression */}
          <MoveJourneyPinnedScroll />

          {/* 8. Scrubbed Giant Typography Parallax */}
          <MvpTextParallax />

          {/* 11. Contact / Relocation Proposal Section: Full-screen interactive proposal view */}
          <MvpContactSection id="estimate-calculator" />
        </main>

        {/* 12. Global Rich Footer */}
        <LandingFooter />

        {/* 13. Back to Top Floating Interaction */}
        <MvpBackToTop />
      </div>
    </SmoothScrollProvider>
  );
};

export default LandingPage;
