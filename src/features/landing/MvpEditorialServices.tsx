'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, CheckCircle2, ClipboardList } from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ServiceDetail {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  serviceBadge: string;
  features: string[];
  ctaText: string;
}

export const editorialServices: ServiceDetail[] = [
  {
    number: '01',
    title: 'Residential Moving',
    subtitle: 'Homes · Apartments · Townhomes',
    description:
      'Full-service home relocation handled by certified movers, from packing and protection to room-by-room furniture placement.',
    image: '/images/local.jpg',
    serviceBadge: 'SERVICE 01',
    features: [
      'Quilted wraps & door jamb protection',
      'Floor runners for hardwood & carpet',
      'Bed & furniture reassembly included',
    ],
    ctaText: 'Calculate Residential Rate',
  },
  {
    number: '02',
    title: 'Corporate & Office Moving',
    subtitle: 'Offices · Medical Suites · Workstations',
    description:
      'Commercial relocation planned around your business hours with minimum downtime and structured workstation teardown.',
    image: '/images/commercial.jpg',
    serviceBadge: 'SERVICE 02',
    features: [
      'IT workstation disconnect & cable labeling',
      'Weekend & after-hours dispatch options',
      'COI multi-million commercial insurance',
    ],
    ctaText: 'Calculate Corporate Rate',
  },
  {
    number: '03',
    title: 'Fine Art & Specialty Moving',
    subtitle: 'Dishes · Fine China · Antiques & Art',
    description:
      'Custom wooden crating, archival wrapping materials, and white-glove care for fragile antiques, fine china, and oil paintings.',
    image: '/images/packing.jpg',
    serviceBadge: 'SERVICE 03',
    features: [
      'Reinforced glass & custom canvas crates',
      'Museum-standard acid-free wrapping layers',
      'Climate vault short & long term holding',
    ],
    ctaText: 'Calculate Specialty Rate',
  },
  {
    number: '04',
    title: 'Direct Truck Delivery',
    subtitle: 'Dedicated Texas Statewide Transit',
    description:
      'Statewide point-to-point dedicated transport with no shared trailer space, intermediate transfers, or offloading delays.',
    image: '/images/long_distance.jpg',
    serviceBadge: 'SERVICE 04',
    features: [
      'Dedicated door-to-door direct truck route',
      'Same in-house crew loads, drives & unloads',
      'Real-time live GPS transit monitoring',
    ],
    ctaText: 'Calculate Direct Delivery',
  },
  {
    number: '05',
    title: 'Warehouse & Storage',
    subtitle: 'Climate Vaults · 24/7 Monitored',
    description:
      'Secure climate-controlled wooden vault storage inside our 24/7 monitored Lewisville Station 1 & Station 2 distribution hubs.',
    image: '/images/storage.jpg',
    serviceBadge: 'SERVICE 05',
    features: [
      'Climate-controlled Texas humidity defense',
      'Locked individual palletized wooden vaults',
      'Continuous 24/7 digital surveillance',
    ],
    ctaText: 'Calculate Storage Rate',
  },
  {
    number: '06',
    title: 'Heavy-Duty Moving',
    subtitle: 'Safes · Grand Pianos · Rigging',
    description:
      'Heavy-duty hydraulic lifts, specialized stair climbers, and reinforced rigging straps for grand pianos, gun safes, and stone tables.',
    image: '/images/truckk.jpg',
    serviceBadge: 'SERVICE 06',
    features: [
      'Grand & upright piano specialized skids',
      'Motorized heavy safe stair crawler dollies',
      'Full comprehensive high-value care coverage',
    ],
    ctaText: 'Calculate Rigging Rate',
  },
];

export const MvpEditorialServices: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);
  const truckMarkerRef = useRef<SVGGElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isFirstPreviewRender = useRef(true);
  const [activePreview, setActivePreview] = useState<ServiceDetail>(editorialServices[0]);

  // Track active index and user hover state for scroll-driven switching
  const activeIndexRef = useRef<number>(0);
  const isUserHoveringRef = useRef<boolean>(false);
  const userInteractedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSwitchTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const svgPath = svgPathRef.current;
      const truckMarker = truckMarkerRef.current;
      let pathLength = 0;
      if (svgPath) {
        try {
          pathLength = svgPath.getTotalLength() || 0;
        } catch {
          pathLength = 0;
        }
      }

      if (svgPath && pathLength > 10) {
        svgPath.style.strokeDasharray = `${pathLength}`;
        svgPath.style.strokeDashoffset = `${pathLength}`;

        // Park the truck at the start of the road immediately so it's visible
        // on first paint, before any scroll has happened.
        if (truckMarker) {
          const startPt = svgPath.getPointAtLength(0);
          const nextPt = svgPath.getPointAtLength(Math.min(pathLength, 4));
          const startAngle = Math.atan2(nextPt.y - startPt.y, nextPt.x - startPt.x) * (180 / Math.PI);
          truckMarker.style.opacity = '1';
          truckMarker.setAttribute('transform', `translate(${startPt.x}, ${startPt.y}) rotate(${startAngle})`);
        }
      }

      // 0. Staggered entrance for service items & showcase card
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion && sectionRef.current) {
        gsap.fromTo(
          '.service-item',
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.editorial-services-content',
              start: 'top 90%',
              once: true,
            },
          }
        );
      }

      // 0b. Pinned, Calibrated ScrollTrigger:
      // Locks the section in place across 2200px of scroll distance,
      // giving generous, relaxed scroll room so transitions never feel rushed or glitchy.
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;

            // 1. Synchronize road SVG path and leading pickup truck marker
            if (svgPath && pathLength > 10) {
              const currentOffset = pathLength * (1 - p);
              svgPath.style.strokeDashoffset = `${currentOffset}`;

              if (truckMarker) {
                truckMarker.style.opacity = '1';
                const drawnLength = Math.max(0, Math.min(pathLength, pathLength - currentOffset));
                const pt = svgPath.getPointAtLength(drawnLength);
                const pPrev = svgPath.getPointAtLength(Math.max(0, drawnLength - 4));
                const pNext = svgPath.getPointAtLength(Math.min(pathLength, drawnLength + 4));
                const dx = pNext.x - pPrev.x;
                const dy = pNext.y - pPrev.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                truckMarker.setAttribute(
                  'transform',
                  `translate(${pt.x}, ${pt.y}) rotate(${angle})`
                );
              }
            }

            // Progressive card switching with dwell throttle
            if (isUserHoveringRef.current) return;
            const total = editorialServices.length;
            const targetIndex = Math.min(
              total - 1,
              Math.max(0, Math.floor(p * total))
            );

            const now = Date.now();
            if (targetIndex !== activeIndexRef.current) {
              // Throttle rapid flicks so cards don't strobe
              if (now - lastSwitchTimeRef.current >= 200 || Math.abs(targetIndex - activeIndexRef.current) === 1) {
                lastSwitchTimeRef.current = now;
                activeIndexRef.current = targetIndex;
                setActivePreview(editorialServices[targetIndex]);
              }
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (userInteractedTimeoutRef.current) clearTimeout(userInteractedTimeoutRef.current);
    };
  }, []);

  // Cinematic crossfade + Ken Burns zoom for the showcase image, plus a
  // staggered fade for its badge/title/description/features/CTA whenever
  // the active service changes (scroll-driven, click, or hover).
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();

    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { opacity: 0.25, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' },
        0
      );
    }

    if (badgeRef.current) {
      tl.fromTo(
        badgeRef.current,
        { opacity: 0.3, x: -8 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' },
        0
      );
    }

    if (contentRef.current) {
      const items = contentRef.current.querySelectorAll('.svc-anim-item');
      if (items.length) {
        tl.fromTo(
          items,
          { opacity: 0.3, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' },
          0.04
        );
      }
    }

    isFirstPreviewRender.current = false;

    return () => {
      tl.kill();
    };
  }, [activePreview]);

  const handleSelectService = (svc: ServiceDetail) => {
    const idx = editorialServices.findIndex((s) => s.number === svc.number);
    if (idx !== -1) {
      activeIndexRef.current = idx;
    }
    setActivePreview(svc);
    isUserHoveringRef.current = true;
    if (userInteractedTimeoutRef.current) clearTimeout(userInteractedTimeoutRef.current);
    userInteractedTimeoutRef.current = setTimeout(() => {
      isUserHoveringRef.current = false;
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="min-h-screen py-2 sm:py-6 lg:py-8 flex flex-col justify-center bg-black text-white relative overflow-hidden"
    >
      {/* 0. Scroll-Driven Gray Asphalt Road & Animated Driving Truck (Desktop only) */}
      <svg
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="servicesTruckGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Dynamic Scroll Reveal Mask (Flowing Top-Right -> Bottom-Left) */}
          <mask id="servicesRoadMask">
            <path
              ref={svgPathRef}
              d="M 1480 100 C 1260 40, 1080 70, 960 240 C 860 390, 1000 530, 1200 570 C 1380 610, 1420 750, 1280 830 C 1140 890, 860 840, 660 670 C 460 500, 300 660, -40 820"
              stroke="#ffffff"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
          </mask>
        </defs>

        {/* Revealed Road Layers (Masked to Scroll) */}
        <g mask="url(#servicesRoadMask)">
          {/* Road Border / Kerb */}
          <path
            d="M 1480 100 C 1260 40, 1080 70, 960 240 C 860 390, 1000 530, 1200 570 C 1380 610, 1420 750, 1280 830 C 1140 890, 860 840, 660 670 C 460 500, 300 660, -40 820"
            stroke="#52525b"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />

          {/* Gray Asphalt Road Surface */}
          <path
            d="M 1480 100 C 1260 40, 1080 70, 960 240 C 860 390, 1000 530, 1200 570 C 1380 610, 1420 750, 1280 830 C 1140 890, 860 840, 660 670 C 460 500, 300 660, -40 820"
            stroke="#27272a"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle Grey Dotted / Dashed Centerline */}
          <path
            d="M 1480 100 C 1260 40, 1080 70, 960 240 C 860 390, 1000 530, 1200 570 C 1380 610, 1420 750, 1280 830 C 1140 890, 860 840, 660 670 C 460 500, 300 660, -40 820"
            stroke="#71717a"
            strokeWidth="1.75"
            strokeDasharray="6 8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>

        {/* Leading Animated Moving Truck Marker (Turned Upside Down) */}
        <g ref={truckMarkerRef} className="overflow-visible pointer-events-none" style={{ opacity: 1 }}>
          <g transform="scale(1, -1)">
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
        </g>
      </svg>

      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto relative z-10">
        {/* 1. Top Header Row: Title on Left, CTA on Top-Right */}
        <div className="editorial-services-header flex flex-col md:flex-row md:items-start justify-between gap-2 sm:gap-4 mb-2.5 sm:mb-5 lg:mb-6">
          <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
            <div className="svc-kicker text-red-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest font-mono">
              TEXAS BASED. NATIONWIDE DISPATCH.
            </div>
            <TextReveal
              as="h2"
              className="svc-heading display-heading display-heading--editorial text-white mb-0.5 sm:mb-1"
            >
              <span className="text-white block">Move anything.</span>
              <span className="bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text block">
                We&apos;ll handle the rest.
              </span>
            </TextReveal>
            <p className="hidden sm:block svc-subtext text-neutral-400 text-xs sm:text-[13px] pt-0.5 leading-relaxed">
              Explore our residential, corporate, specialty and logistics services. Every move has a plan.
            </p>
          </div>

          {/* CTA at top right - hidden on mobile to avoid redundant vertical stacking */}
          <a
            href="#estimate-calculator"
            className="hidden sm:inline-flex svc-header-cta items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-[13px] transition-all shadow-md shadow-red-600/30 self-start md:self-auto hover:scale-105 shrink-0"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Request Service Proposal</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* 2. Balanced 2-Column Layout */}
        <div className="editorial-services-content grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-5 lg:gap-6 items-stretch">
          <div
            onMouseLeave={() => {
              isUserHoveringRef.current = false;
            }}
            className="editorial-services-list lg:col-span-5 flex flex-col justify-between gap-1 sm:gap-2"
          >
            {editorialServices.map((svc) => {
              const isActive = activePreview.number === svc.number;
              return (
                <div
                  key={svc.number}
                  onMouseEnter={() => handleSelectService(svc)}
                  onClick={() => handleSelectService(svc)}
                  className={`service-item min-h-[34px] sm:min-h-[56px] sm:h-[62px] py-1 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                    isActive
                      ? 'bg-[#151515] border-red-500/80 shadow-sm'
                      : 'bg-[#0f0f0f] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#131313]'
                  }`}
                >
                  {/* Subtle red indicator */}
                  {isActive && (
                    <div className="active-indicator absolute bottom-0 left-4 w-12 h-[2px] bg-red-500 rounded-full origin-left animate-[indicator-grow_0.4s_ease-out]"></div>
                  )}

                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <span
                      className={`service-number font-mono text-xs sm:text-base font-bold shrink-0 transition-colors ${
                        isActive ? 'text-red-500' : 'text-neutral-500 group-hover:text-neutral-200'
                      }`}
                    >
                      {svc.number}
                    </span>
                    <div className="truncate min-w-0">
                      {/* Title wrapper: smoothly shifts down to center itself when subtitle vanishes */}
                      <div className="service-title-wrap">
                        <div className="relative overflow-hidden block py-0.5">
                          <h3 className="service-name service-title-primary text-xs sm:text-[13px] font-bold text-white tracking-tight truncate block">
                            {svc.title}
                          </h3>
                          <h3
                            aria-hidden="true"
                            className="service-name service-title-duplicate text-xs sm:text-[13px] font-bold text-white tracking-tight truncate absolute inset-0 py-0.5 pointer-events-none"
                          >
                            {svc.title}
                          </h3>
                        </div>
                      </div>
                      {/* Subtitle: hidden on compact mobile to save critical vertical space */}
                      <p className="hidden sm:block service-description text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 truncate">
                        {svc.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`service-arrow-wrap w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ml-2 sm:ml-2.5 transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                        : 'text-neutral-500 group-hover:text-white group-hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 overflow-hidden flex items-center justify-center">
                      {isActive ? (
                        <>
                          <ArrowRight className="service-arrow-primary-h w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                          <ArrowRight className="service-arrow-duplicate-h w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 absolute inset-0 pointer-events-none" />
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="service-arrow-primary w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                          <ArrowUpRight className="service-arrow-duplicate w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 absolute inset-0 pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 Cols): Streamlined Showcase Card with Hero Photo */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <TiltCard className="h-full rounded-2xl" maxTilt={6.5} perspective={1100} scale={1.018} delayMs={1200}>
              <div className="showcase-card h-full flex flex-col justify-between bg-[#121212] border border-neutral-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xl space-y-2 sm:space-y-3">
                {/* Hero Image (16:6 on mobile, 16:7.8 on desktop) */}
                <div data-tilt-depth="6" className="relative aspect-[16/6] sm:aspect-[16/7.8] max-h-36 sm:max-h-none w-full rounded-lg sm:rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    key={activePreview.number}
                    ref={imageRef}
                    src={activePreview.image}
                    alt={activePreview.title}
                    className="service-image w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div data-tilt-depth="24" className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                    <span
                      key={`badge-${activePreview.number}`}
                      ref={badgeRef}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-600 text-white font-mono text-[9px] sm:text-[10px] font-bold rounded-md shadow-md tracking-wider uppercase inline-block"
                    >
                      {activePreview.serviceBadge}
                    </span>
                  </div>
                </div>

                {/* Clean Content Area with stable min-height */}
                <div key={`content-${activePreview.number}`} ref={contentRef} className="service-content space-y-1.5 sm:space-y-2.5 flex-1 flex flex-col justify-between">
                  <div data-tilt-depth="14" className="svc-anim-item">
                    <h3 className="text-sm sm:text-lg lg:text-xl font-black text-white tracking-tight">
                      {activePreview.title}
                    </h3>
                    <p className="hidden lg:block text-xs text-neutral-400 leading-snug mt-0.5 min-h-[28px]">
                      {activePreview.description}
                    </p>
                  </div>

                  {/* 3 Clean Features */}
                  <div data-tilt-depth="18" className="svc-anim-item space-y-0.5 sm:space-y-1 pt-0.5">
                    {activePreview.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-neutral-200">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rate CTA */}
                  <div data-tilt-depth="22" className="svc-anim-item pt-0.5 sm:pt-1">
                    <a
                      href="#estimate-calculator"
                      className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all hover:scale-[1.02]"
                    >
                      <span>{activePreview.ctaText}</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MvpEditorialServices;

