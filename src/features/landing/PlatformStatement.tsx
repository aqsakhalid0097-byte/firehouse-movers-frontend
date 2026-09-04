'use client';

import React from 'react';
import { Flame, Shield, CheckCircle } from 'lucide-react';

export const PlatformStatement: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#121212] border-y border-neutral-800/80 relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Statement */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
              The moving service America needed, so we built it for you.
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Moving is consistently ranked as one of life’s most stressful events. We started Firehouse Movers to change that standard forever. We treat your possessions, home, and timeline with the same protective urgency, honesty, and muscle we bring to our firefighting shifts.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Zero Hidden Fees or Travel Surprises</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Floors & Door Jambs Fully Protected</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Clean, Modern 26-Foot Air-Ride Fleet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Specialty Antiques & Piano Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#1c1c1c] to-[#141414] border border-neutral-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-black text-xl">
                    FM
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Firehouse Standard</h4>
                    <p className="text-xs text-gray-400">Guaranteed Operational Protocol</p>
                  </div>
                </div>
                <Shield className="w-6 h-6 text-red-400" />
              </div>

              <div className="space-y-4 pt-6 text-xs sm:text-sm text-gray-300">
                <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">Crew Background Checks</span>
                  <span className="font-semibold text-emerald-400">100% Verified</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">Furniture Padding & Wrapping</span>
                  <span className="font-semibold text-white">Included Standard</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">Disassembly & Reassembly</span>
                  <span className="font-semibold text-white">Beds & Tables Free</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">On-Time Arrival Rate</span>
                  <span className="font-semibold text-red-400">99.4% On Schedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStatement;
