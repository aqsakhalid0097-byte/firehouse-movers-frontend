'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';

export const LandingCtaBanner: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-950 text-white relative overflow-hidden border-y border-red-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Stress-Free Moving Guaranteed</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Ready for a Smooth, Disciplined Move?
        </h2>

        <p className="text-base sm:text-xl text-red-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Lock in your preferred date with our veteran firefighter-led crews. Get a free, no-obligation moving quote today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#estimate-calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-gray-100 text-red-700 font-extrabold text-base shadow-2xl transition-all cursor-pointer hover:scale-105"
          >
            <Calculator className="w-5 h-5" />
            <span>Get Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="tel:9725399588"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white font-bold text-base backdrop-blur-md transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-red-400" />
            <span>Call (972) 539-9588</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaBanner;
