'use client';

import React from 'react';
import { Calculator, ArrowRight, ShieldCheck, Star, Truck } from 'lucide-react';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center bg-black text-white pt-24 pb-20 overflow-hidden">
      {/* High-Visibility Truck Fleet Video Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero_sunset_truck.jpg"
          className="w-full h-full object-cover object-[center_40%] relative"
        >
          <source src="/documents/truck_background_video.mp4" type="video/mp4" />
        </video>
        {/* Soft Contrast Gradient Mask for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.08] max-w-5xl drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
          Relocate with the <br />
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
            Strength & Precision
          </span>{' '}
          of Firefighters
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl text-gray-100 max-w-3xl mb-10 leading-relaxed font-medium drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          From residential homes to commercial corporate offices, our 26-foot air-ride fleet delivers disciplined care, transparent rates, and dependable muscle across Texas.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <a
            href="#estimate-calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-2xl shadow-red-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-red-500/50"
          >
            <Calculator className="w-5 h-5" />
            <span>Get Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#fleet-3d"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-black/80 hover:bg-black/95 border border-white/30 hover:border-white/60 text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer shadow-xl"
          >
            <Truck className="w-4 h-4 text-red-400" />
            <span>Inspect 3D Fleet</span>
          </a>
        </div>

        {/* Clean Horizontal Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl pt-6 text-left bg-black/75 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 shrink-0">
              <Star className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">4.9 / 5.0 Rating</div>
              <div className="text-xs text-gray-300">3,500+ Texas Reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Fully Insured</div>
              <div className="text-xs text-gray-300">TXDMV & DOT Certified</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">26ft Air-Ride Fleet</div>
              <div className="text-xs text-gray-300">Zero Cargo Shock</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 shrink-0">
              <span className="font-black text-red-400 text-sm">20+</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm">Years in Service</div>
              <div className="text-xs text-gray-300">Serving TX Since 2004</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
