'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MvpAboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);
  const truckMarkerRef = useRef<SVGGElement | null>(null);
  const yearsRef = useRef<HTMLSpanElement | null>(null);
  const movesRef = useRef<HTMLSpanElement | null>(null);
  const rateRef = useRef<HTMLSpanElement | null>(null);
  const crewRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 0. Scroll-Driven Vector SVG Ribbon Path & Leading Truck Animation (Lockstep Synced)
      const svgPath = svgPathRef.current;
      const truckMarker = truckMarkerRef.current;
      if (svgPath) {
        let length = 0;
        try {
          length = svgPath.getTotalLength() || 0;
        } catch {
          length = 0;
        }

        if (length > 10) {
          svgPath.style.strokeDasharray = `${length}`;
          svgPath.style.strokeDashoffset = `${length}`;

          const animState = { offset: length };

          const syncFrame = () => {
            const currentOffset = animState.offset;
            svgPath.style.strokeDashoffset = `${currentOffset}`;

            if (!truckMarker) return;
            const drawnLength = Math.max(0, Math.min(length, length - currentOffset));

            truckMarker.style.opacity = '1';

            const pt = svgPath.getPointAtLength(drawnLength);

            // Tangent angle so the truck naturally rotates along the road curve
            const pPrev = svgPath.getPointAtLength(Math.max(0, drawnLength - 4));
            const pNext = svgPath.getPointAtLength(Math.min(length, drawnLength + 4));
            const dx = pNext.x - pPrev.x;
            const dy = pNext.y - pPrev.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            truckMarker.setAttribute(
              'transform',
              `translate(${pt.x}, ${pt.y}) rotate(${angle})`
            );
          };

          syncFrame();

          gsap.to(animState, {
            offset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 0.4,
            },
            onUpdate: syncFrame,
          });
        }
      }

      // 1. Text & Layout Entrance Timeline
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      aboutTl
        .from(
          '.about-description',
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          }
        )
        .from(
          '.about-button',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.4'
        );

      // 2. Image Mask Reveal with Zoom
      gsap.from('.about-img-mask', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '.about-img-mask',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.about-img-zoom', {
        scale: 1.35,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-img-mask',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 3. Ultra-Clean Minimal Stats Rolling Number Animation
      const statsObj = { years: 0, moves: 0, rate: 0, crew: 0 };

      // Entrance animation for stats row
      gsap.from('.stat-metric-item', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-stats-grid',
          start: 'top 85%',
          toggleActions: 'restart none none reverse',
        },
      });

      // Rolling count-up animation
      gsap.to(statsObj, {
        years: 20,
        moves: 50,
        rate: 99.4,
        crew: 100,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-stats-grid',
          start: 'top 85%',
          toggleActions: 'restart none none reverse',
        },
        onUpdate: () => {
          if (yearsRef.current) {
            yearsRef.current.textContent = `${Math.floor(statsObj.years)}+`;
          }
          if (movesRef.current) {
            movesRef.current.textContent = `${Math.floor(statsObj.moves)},000+`;
          }
          if (rateRef.current) {
            rateRef.current.textContent = `${statsObj.rate.toFixed(1)}%`;
          }
          if (crewRef.current) {
            crewRef.current.textContent = `${Math.floor(statsObj.crew)}%`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#0c0c0c] text-white border-y border-neutral-800/80 relative overflow-hidden"
    >
      {/* Scroll-Driven Glowing Red SVG Ribbon Vector Path & Leading Truck (Desktop only) */}
      <svg
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="aboutGlowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="truckGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          {/* Dynamic Scroll Reveal Mask */}
          <mask id="aboutRoadMask">
            <path
              ref={svgPathRef}
              d="M -40 100 C 180 40, 360 70, 480 240 C 580 390, 440 530, 240 570 C 60 610, 20 750, 160 830 C 300 890, 580 840, 780 670 C 980 500, 1140 660, 1480 820"
              stroke="#ffffff"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
          </mask>
        </defs>

        {/* Revealed Road Layers (Masked) */}
        <g mask="url(#aboutRoadMask)">
          {/* Road Border / Kerb */}
          <path
            d="M -40 100 C 180 40, 360 70, 480 240 C 580 390, 440 530, 240 570 C 60 610, 20 750, 160 830 C 300 890, 580 840, 780 670 C 980 500, 1140 660, 1480 820"
            stroke="#52525b"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
          {/* Gray Asphalt Road Surface */}
          <path
            d="M -40 100 C 180 40, 360 70, 480 240 C 580 390, 440 530, 240 570 C 60 610, 20 750, 160 830 C 300 890, 580 840, 780 670 C 980 500, 1140 660, 1480 820"
            stroke="#27272a"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle Grey Dotted / Dashed Centerline */}
          <path
            d="M -40 100 C 180 40, 360 70, 480 240 C 580 390, 440 530, 240 570 C 60 610, 20 750, 160 830 C 300 890, 580 840, 780 670 C 980 500, 1140 660, 1480 820"
            stroke="#71717a"
            strokeWidth="1.75"
            strokeDasharray="6 8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>

        {/* Animated Moving Truck Marker Leading the Vector Line */}
        <g ref={truckMarkerRef} className="overflow-visible pointer-events-none" style={{ opacity: 1 }}>
          {/* Firehouse Pickup Truck Graphic */}
          <image
            href="/images/firehouse_pickup_truck.png"
            width="120"
            height="42"
            x="-60"
            y="-21"
            preserveAspectRatio="xMidYMid meet"
            className="drop-shadow-lg"
          />
        </g>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Mask & Zoom */}
          <div className="lg:col-span-6">
            <TiltCard className="rounded-3xl" maxTilt={6.5} perspective={1100} scale={1.018} delayMs={1400}>
              <div className="about-img-mask relative rounded-3xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-900 group">
                <img
                  src="/images/firehouse_station.jpeg"
                  alt="Firehouse Central Station Hub"
                  data-tilt-depth="6"
                  className="about-img-zoom w-full h-[400px] sm:h-[480px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div
                  data-tilt-depth="22"
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-700 shadow-xl"
                >
                  <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                    Lewisville, TX • Station 1 Operations Hub
                  </div>
                  <div className="text-white font-black text-sm sm:text-base">
                    Built on Firestation Brotherhood & Disciplined Logistics
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <TextReveal
              as="h2"
              className="about-title display-heading display-heading--section text-white"
            >
              The moving standard America needed, so we built it.
            </TextReveal>

            <p className="about-description text-gray-300 text-base sm:text-lg leading-relaxed">
              Founded in 2004 around the kitchen table of a North Texas fire station, we set out to eliminate the broken promises, careless handling, and hidden charges of the moving industry. We bring the same protective urgency, honesty, and muscle we deliver on emergency calls to every family and business we relocate.
            </p>

            <div className="about-description grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-sm text-gray-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Zero temporary day labor policy</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>26ft Air-ride commercial fleet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>2 central distribution warehouses</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Transparent written estimate guarantee</span>
              </div>
            </div>

            <div className="about-button pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-white font-bold text-sm transition-all hover:scale-105 shadow-xl"
              >
                <span>Learn More About Our Journey</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal, Modern High-Impact Statistics Grid (Strictly Red / Black / Gray Theme) */}
        <div className="about-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-5 xs:gap-8 sm:gap-12 pt-12 sm:pt-20 mt-12 sm:mt-20 border-t border-neutral-800/80">
          {/* Stat 1: 20+ Years */}
          <div className="stat-metric-item flex flex-col items-center text-center group cursor-default">
            <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-red-500 font-sans tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span ref={yearsRef}>20+</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-2 group-hover:text-red-400 transition-colors">
              Years in Service
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Continuous Texas Operations
            </div>
          </div>

          {/* Stat 2: 50,000+ Moves */}
          <div className="stat-metric-item flex flex-col items-center text-center group cursor-default">
            <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-red-500 font-sans tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span ref={movesRef}>50,000+</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-2 group-hover:text-red-400 transition-colors">
              Moves Completed
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Residential & Commercial
            </div>
          </div>

          {/* Stat 3: 99.4% On-Time */}
          <div className="stat-metric-item flex flex-col items-center text-center group cursor-default">
            <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-red-500 font-sans tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span ref={rateRef}>99.4%</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-2 group-hover:text-red-400 transition-colors">
              On-Time Arrival
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              GPS-Dispatched Fleet
            </div>
          </div>

          {/* Stat 4: 100% In-House */}
          <div className="stat-metric-item flex flex-col items-center text-center group cursor-default">
            <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-red-500 font-sans tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span ref={crewRef}>100%</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-2 group-hover:text-red-400 transition-colors">
              In-House Crews
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Zero Day Labor Policy
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MvpAboutSection;
