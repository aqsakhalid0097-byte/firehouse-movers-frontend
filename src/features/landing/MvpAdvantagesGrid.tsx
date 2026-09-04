'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  Truck,
  Warehouse,
  Clock,
  Navigation,
  Users2,
  ShieldCheck,
  Scale,
  ArrowUpRight,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const advantagesList = [
  {
    id: '01',
    title: '20+ Years Experience',
    description: 'Over two decades of proven reliability relocating Texas families and Fortune 500 corporate offices.',
    icon: <Calendar className="w-5 h-5 text-red-500" />,
  },
  {
    id: '02',
    title: 'Modern 26ft Air-Ride Fleet',
    description: 'Commercial air-ride suspension and sanitized cargo bays ensure zero vibration damage to fragile goods.',
    icon: <Truck className="w-5 h-5 text-red-500" />,
  },
  {
    id: '03',
    title: 'Station 1 & 2 Warehouses',
    description: 'Dedicated climate-controlled wooden vault storage and heavy rigging facilities in Lewisville, TX.',
    icon: <Warehouse className="w-5 h-5 text-red-400" />,
  },
  {
    id: '04',
    title: '24/7 Dispatch Coordination',
    description: 'Direct communication with your lead mover coordinator from pre-trip departure to final signature.',
    icon: <Clock className="w-5 h-5 text-red-500" />,
  },
  {
    id: '05',
    title: 'Dedicated Route Transport',
    description: 'Door-to-door transit without sharing trailer space, intermediate hub delays, or freight transfers.',
    icon: <Navigation className="w-5 h-5 text-red-400" />,
  },
  {
    id: '06',
    title: 'In-House Firefighter Team',
    description: '100% full-time background-checked movers with strict physical fitness and safety discipline standards.',
    icon: <Users2 className="w-5 h-5 text-red-500" />,
  },
  {
    id: '07',
    title: 'Comprehensive Cargo Insurance',
    description: 'Fully licensed and insured under TXDMV #006492023C and Federal Motor Carrier Safety standards.',
    icon: <ShieldCheck className="w-5 h-5 text-red-400" />,
  },
  {
    id: '08',
    title: 'Transparent Written Proposals',
    description: 'Guaranteed quotes with zero hidden stair fees, fuel surcharges, or unexpected travel fees.',
    icon: <Scale className="w-5 h-5 text-red-500" />,
  },
];

export const MvpAdvantagesGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.advantages-header', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // Staggered Cards Entrance
      gsap.from('.advantage-card', {
        y: 70,
        opacity: 0,
        duration: 0.8,
        stagger: {
          each: 0.08,
          from: 'start',
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.advantages-cards-grid',
          start: 'top 80%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 sm:py-32 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="advantages-header text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built on Firefighter Precision & Power
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Eight foundational operational advantages engineered to make your move seamless, predictable, and stress-free.
          </p>
        </div>

        {/* 8 Advantages Staggered 4x2 Grid */}
        <div className="advantages-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantagesList.map((adv) => (
            <div
              key={adv.id}
              className="advantage-card bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-800/90 hover:border-red-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white group-hover:border-red-500/40 transition-colors">
                    {adv.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-red-400 transition-colors">
                    {adv.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-red-400 transition-colors">
                  {adv.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {adv.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                <span>Verified Protocol</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MvpAdvantagesGrid;
