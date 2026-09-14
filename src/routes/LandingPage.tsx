'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { SmoothScrollProvider } from '../features/landing/SmoothScrollProvider';
import { MvpPreloader } from '../features/landing/MvpPreloader';
import { MvpLandingHero } from '../features/landing/MvpLandingHero';
import { ClientWhoWeAreSection } from '../features/landing/ClientWhoWeAreSection';
import { HamzaServicesSection } from '../features/landing/HamzaServicesSection';
import { HybridHowItWorksSection } from '../features/landing/HybridHowItWorksSection';
import { MoveJourneyPinnedScroll } from '../features/journey/MoveJourneyPinnedScroll';
import { ClientGuaranteesSection } from '../features/landing/ClientGuaranteesSection';
import { ClientPackagingSection } from '../features/landing/ClientPackagingSection';
import { TestimonialsSection } from '../features/landing/TestimonialsSection';
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
        {/* Navigation Bar */}
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

        <main>
          {/* 1. Hero Section (Mine) */}
          <MvpLandingHero />

          {/* 2. Who We Are Section (Client Website with Interactive Particle Crew) */}
          <ClientWhoWeAreSection />

          {/* 3. Services Section (Hamza 3D Tilt & Glare Editorial Cards) */}
          <HamzaServicesSection />

          {/* 4. How It Works (Hybrid: Description & Cards in Same Line like Client, Design like Hamza) */}
          <HybridHowItWorksSection />

          {/* 5. Move Wavelength Journey (Mine, Improved with Interactive Nodes & Vector Marker) */}
          <MoveJourneyPinnedScroll />

          {/* 6. Irreplaceable Highlights from Client Website (Written Guarantees, Reviews, FAQ) */}
          <ClientGuaranteesSection />

          {/* 6.1 Museum-Grade Packaging Protocol Sequence (5-Stage Transition with Closing Box) */}
          <ClientPackagingSection />

          <TestimonialsSection />

          {/* 7. Contact Section (Mine with Lusion-Style Square Particle Scatter Canvas) */}
          <MvpContactSection id="estimate-calculator" />
        </main>

        {/* Global Rich Footer & Back To Top */}
        <LandingFooter />
        <MvpBackToTop />
      </div>
    </SmoothScrollProvider>
  );
};

export default LandingPage;

