'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Home, Building2, Package, Truck, Shield, Sparkles, Calendar, Clock, CheckCircle } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ServiceItem {
  id: string;
  badge: string;
  image: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  features: string[];
}

export const servicesList: ServiceItem[] = [
  {
    id: 'residential',
    badge: 'RESIDENTIAL',
    image: '/images/resident.jpg',
    title: 'Full Residential & Home Relocation',
    description:
      'Complete home and apartment moves with certified lead movers, heavy quilted blanket padding, door jamb guards, and room-by-room placement.',
    date: 'Daily DFW Routes',
    tag: '26ft Air-Ride Fleet',
    features: ['Shrink wrap & blankets included', 'Beds disassembled & assembled', 'Floor runner surface protection'],
  },
  {
    id: 'commercial',
    badge: 'COMMERCIAL',
    image: '/images/commercial.jpg',
    title: 'Commercial Office & Facility Moves',
    description:
      'Minimize business downtime with scheduled weekend moves, IT workstation handling, modular cubicle teardown, and dedicated project coordinators.',
    date: 'After-Hours Available',
    tag: 'COI Insurance Standard',
    features: ['Dedicated project move coordinator', 'Coded labeling for workstations', 'Heavy file & server transport'],
  },
  {
    id: 'packing',
    badge: 'PACKING',
    image: '/images/packing.jpg',
    title: 'Turnkey Packing & Custom Crating',
    description:
      'Trained packing specialists carefully box dishes, fine china, books, and wardrobe items with commercial-grade boxes and eco-friendly supplies.',
    date: 'Full & Partial Options',
    tag: 'Zero Breakage Record',
    features: ['Wardrobe boxes for hanging clothes', 'Custom dish-pack partitions', 'Glass & artwork protection'],
  },
  {
    id: 'long-distance',
    badge: 'LONG DISTANCE',
    image: '/images/long_distance.jpg',
    title: 'Texas Statewide Direct-Route Moves',
    description:
      'Dedicated direct truck transport across Texas without sharing trailer space, cargo transfers, or passing through intermediary warehouse hubs.',
    date: 'Guaranteed Delivery Date',
    tag: 'GPS Live Tracking',
    features: ['Direct door-to-door delivery', 'Same crew loading & unloading', 'Real-time GPS dispatch'],
  },
  {
    id: 'storage',
    badge: 'VAULT STORAGE',
    image: '/images/storage.jpg',
    title: 'Station 1 & 2 Climate Vault Storage',
    description:
      'Short-term and long-term secure wooden vault storage inside our 24/7 digitally monitored, climate-controlled Lewisville warehouse facilities.',
    date: 'Flexible Terms',
    tag: '24/7 Security Monitored',
    features: ['Climate-controlled environment', '24/7 video surveillance', 'Itemized warehouse receipt'],
  },
  {
    id: 'specialty',
    badge: 'SPECIALTY RIGGING',
    image: '/images/truckk.jpg',
    title: 'Heavy Safes, Pianos & Fine Antiques',
    description:
      'Specialized hydraulic liftgates, heavy safe stair crawlers, and reinforced rigging straps for grand pianos, gun safes, and marble tables.',
    date: 'Master Riggers',
    tag: 'Hydraulic Liftgates',
    features: ['Grand & upright piano skids', 'Heavy safe staircase crawlers', 'High-value item insurance'],
  },
];

export const ServicesGrid: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Responsive cards per view & GSAP scroll entrance
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // GSAP ScrollTrigger Entrance (re-triggers on scroll into view)
    const ctx = gsap.context(() => {
      gsap.from('.services-shell-box', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  const maxIndex = Math.max(0, servicesList.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section ref={sectionRef} id="services" className="py-20 sm:py-28 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Outer Dark Neutral / Charcoal Shell Container with Styled Rounded Contour */}
        <div className="services-shell-box bg-[#111111] border border-neutral-800 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
          {/* Top Radial Glow Accent */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header Row (Title on Left, Prev/Next Arrows on Right) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Comprehensive Moving Solutions
              </h2>

              <div className="pt-2">
                <a
                  href="#estimate-calculator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-md cursor-pointer hover:scale-105"
                >
                  <span>Get Instant Pricing</span>
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                    →
                  </div>
                </a>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  currentIndex === 0
                    ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white/10 hover:bg-red-600 border-white/20 hover:border-red-500 text-white shadow-lg'
                }`}
                aria-label="Previous Slide"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  currentIndex >= maxIndex
                    ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-red-600 hover:bg-red-500 border-red-500 text-white shadow-xl shadow-red-600/30'
                }`}
                aria-label="Next Slide"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Carousel Window */}
          <div className="overflow-hidden" ref={scrollContainerRef}>
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {servicesList.map((svc) => (
                <div
                  key={svc.id}
                  className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group border border-gray-100"
                >
                  <div>
                    {/* Card Top Image with Tag Badge Overlay */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

                      {/* Top-Left Dark Pill Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-white/20 shadow-md">
                          {svc.badge}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <div className="p-6 sm:p-7 space-y-3">
                      <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                        {svc.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {svc.description}
                      </p>

                      {/* Checklist */}
                      <ul className="space-y-1.5 pt-2 text-xs text-gray-700">
                        {svc.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom Meta Bar */}
                  <div className="px-6 sm:px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{svc.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold text-gray-700">{svc.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === dotIdx ? 'w-8 bg-red-500' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide page ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
