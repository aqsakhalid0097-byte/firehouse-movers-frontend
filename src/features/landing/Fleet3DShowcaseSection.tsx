'use client';

import React from 'react';
import { Truck, ShieldCheck, Zap, Gauge, Sparkles, CheckCircle2 } from 'lucide-react';
import { TruckTrailer3DViewer } from './TruckTrailer3DViewer';

export const Fleet3DShowcaseSection: React.FC = () => {
  return (
    <section id="fleet-3d" className="py-24 sm:py-32 bg-black text-white relative overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Tour Our Commercial 26ft Moving Fleet in 3D
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Drag, rotate, and inspect the purpose-built equipment engineered to safeguard your furniture and valuables on Texas highways.
          </p>
        </div>

        {/* 3D Model Interactive Viewer */}
        <div className="mb-14">
          <TruckTrailer3DViewer height="h-[480px] sm:h-[580px] lg:h-[640px]" />
        </div>

        {/* Fleet Engineering Specs 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#161616] border border-neutral-800 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">Air-Ride Suspension</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Absorbs road vibrations and sudden shocks to ensure delicate glassware, electronics, and antiques stay pristine.
            </p>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">2,500 lb Liftgates</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Heavy-duty hydraulic tuckaway platforms allow smooth, level loading for grand pianos, gun safes, and marble tables.
            </p>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Gauge className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">Full E-Track Logistics</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Multi-tiered horizontal and vertical steel strapping tracks lock padded items rigidly against the cargo box walls.
            </p>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">Sanitized Cargo Bays</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every truck box is swept, wiped, and inspected daily at Station 1 before dispatch to ensure clean transport.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet3DShowcaseSection;
