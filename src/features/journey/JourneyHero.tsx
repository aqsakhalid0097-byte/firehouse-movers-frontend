'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { AnimatedHeading } from '@/components/AnimatedHeading';

export const JourneyHero: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-black text-white overflow-hidden pt-28 pb-16 border-b border-neutral-800">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Kinetic Animated Heading */}
        <AnimatedHeading
          as="h1"
          badge="TEXAS DISPATCH TELEMETRY"
          text="From Loaded to Delivered •"
          gradientText="Your Move in Motion"
          subtitle="Experience how our disciplined firefighter crews manage every critical milestone — from pre-trip dispatch at Station 1, to secure padding, live highway transit, precision unloading, and final 5-star sign-off."
          align="center"
          className="mb-8"
        />

        {/* Scroll Instruction */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-sm font-semibold text-gray-200 animate-pulse">
          <ArrowDown className="w-4 h-4 text-red-400" />
          <span>Scroll down to initiate the pinned journey</span>
        </div>
      </div>
    </section>
  );
};

export default JourneyHero;
