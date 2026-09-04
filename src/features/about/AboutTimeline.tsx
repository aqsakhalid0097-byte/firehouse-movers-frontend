'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { AboutSectionHeader } from './AboutSectionHeader';
import { TiltCard } from '../../components/TiltCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Milestone {
  year: string;
  title: string;
  summary: string;
  detail: string;
  facts: { label: string; value: string }[];
}

const milestones: Milestone[] = [
  {
    year: '2004',
    title: 'First off-duty moves',
    summary: 'Founded by firefighters working between shifts.',
    detail:
      'Weekend work for neighbors and station colleagues. No warehouse, no fleet — just a crew that showed up on time with the price written down.',
    facts: [
      { label: 'Crew', value: '4 firefighters' },
      { label: 'Equipment', value: '1 rented truck' },
      { label: 'Area', value: 'Lewisville & Denton' },
    ],
  },
  {
    year: '2009',
    title: 'Station 1 opens',
    summary: 'Dispatch, crews and fleet staging under one roof.',
    detail:
      'A dedicated Lewisville facility let us schedule crews centrally, stock packing inventory and stop renting equipment. Still our operations HQ.',
    facts: [
      { label: 'Facility', value: 'Lewisville HQ' },
      { label: 'Added', value: 'Central dispatch' },
      { label: 'Added', value: 'Packing warehouse' },
    ],
  },
  {
    year: '2014',
    title: 'Air-ride fleet & direct routes',
    summary: 'Owned air-ride trailers replace shared hauls.',
    detail:
      'Shared trailers meant transfers, delays and split liability. Our own fleet made dedicated point-to-point routes possible.',
    facts: [
      { label: 'Fleet', value: '26ft air-ride' },
      { label: 'Securing', value: 'Steel E-track' },
      { label: 'Routing', value: 'No transfers' },
    ],
  },
  {
    year: '2019',
    title: 'Station 2 vault storage',
    summary: 'Second facility adds vault storage and rigging.',
    detail:
      'Customers between closings needed somewhere secure. Station 2 added palletized wooden vaults under continuous surveillance.',
    facts: [
      { label: 'Storage', value: 'Wooden vaults' },
      { label: 'Climate', value: 'Full facility' },
      { label: 'Monitoring', value: '24/7' },
    ],
  },
  {
    year: 'Today',
    title: 'Same standard, larger operation',
    summary: '50,000+ moves, original crew policy intact.',
    detail:
      '40+ in-house crews across two facilities and statewide routes. The 2004 rules were never relaxed to scale.',
    facts: [
      { label: 'Crews', value: '40+ in-house' },
      { label: 'On-time', value: '99.4%' },
      { label: 'Rating', value: '4.9 ★' },
    ],
  },
];

// Card footprint per breakpoint (width + gap), kept in sync with the
// Tailwind classes on the card and track below so the JS translation math
// matches what actually renders.
const CARD_STEP = {
  base: 280 + 24, // w-[280px] + gap-6
  sm: 380 + 32, // sm:w-[380px] + sm:gap-8
  lg: 420 + 40, // lg:w-[420px] + lg:gap-10
};

function getCardStep(): number {
  if (typeof window === 'undefined') return CARD_STEP.sm;
  const w = window.innerWidth;
  if (w >= 1024) return CARD_STEP.lg;
  if (w >= 640) return CARD_STEP.sm;
  return CARD_STEP.base;
}

export const AboutTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);

  const [mode, setMode] = useState<'carousel' | 'swipe'>('swipe');
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const n = milestones.length;

  // Decide once (and on resize) whether this viewport gets the pinned,
  // scroll-scrubbed coverflow or the plain swipeable row. Touch devices and
  // prefers-reduced-motion always get the swipeable row.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const touch = window.matchMedia('(pointer: coarse)');

    const evaluate = () => setMode(query.matches && !touch.matches ? 'carousel' : 'swipe');
    evaluate();

    query.addEventListener('change', evaluate);
    touch.addEventListener('change', evaluate);
    return () => {
      query.removeEventListener('change', evaluate);
      touch.removeEventListener('change', evaluate);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const st = stRef.current;
    const clamped = Math.max(0, Math.min(n - 1, index));

    if (!st) {
      setActiveIndex(clamped);
      return;
    }

    const target = st.start + (clamped / (n - 1)) * (st.end - st.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, [n]);

  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'carousel') return;

    const trigger = triggerRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!trigger || !pin || !track) return;

    const ctx = gsap.context(() => {
      const distance = Math.max(2400, n * 620);

      const st = ScrollTrigger.create({
        trigger,
        start: 'top top+=120',
        end: `+=${distance}`,
        pin,
        pinSpacing: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const p = self.progress;
          const rawIndex = p * (n - 1);
          const step = getCardStep();

          gsap.set(track, { x: -rawIndex * step });

          cardRefs.current.forEach((el, i) => {
            if (!el) return;
            const dist = Math.min(1, Math.abs(rawIndex - i));
            gsap.set(el, {
              scale: gsap.utils.interpolate(1, 0.82, dist),
              opacity: gsap.utils.interpolate(1, 0.38, dist),
              y: gsap.utils.interpolate(0, 22, dist),
              zIndex: Math.round((1 - dist) * 100),
            });
          });

          const nextIndex = Math.round(rawIndex);
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }

          if (hintVisible && p > 0.08) setHintVisible(false);
        },
      });

      stRef.current = st;
    }, sectionRef);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, n]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="scroll-mt-32 py-16 sm:py-20 bg-[#0b0b0b] border-b border-neutral-800 overflow-hidden"
    >
      <div className="w-[min(1200px,calc(100%-48px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <AboutSectionHeader
            index="02"
            title="Timeline"
            meta={mode === 'carousel' ? 'SCROLL TO MOVE THROUGH TIME' : 'SWIPE TO EXPLORE'}
          />

          <div className="hidden sm:flex items-center gap-3 mb-8 shrink-0">
            <span className="font-mono text-[11px] text-neutral-600 tracking-widest">
              <span className="text-red-500 font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(n).padStart(2, '0')}
            </span>

            {mode === 'carousel' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous milestone"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-red-500 transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next milestone"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === n - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-red-500 transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={triggerRef} className="relative">
        <div
          ref={pinRef}
          className={
            mode === 'carousel'
              ? 'relative h-[540px] sm:h-[560px] lg:h-[600px] flex flex-col justify-center'
              : 'relative'
          }
        >
          {/* Full-bleed viewport so flanking cards can peek off-screen */}
          <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
            <div
              ref={trackRef}
              className={`flex items-center gap-4 sm:gap-8 lg:gap-10 will-change-transform ${
                mode === 'carousel'
                  ? 'pl-[calc(50vw-140px)] pr-[calc(50vw-140px)] sm:pl-[calc(50vw-190px)] sm:pr-[calc(50vw-190px)] lg:pl-[calc(50vw-210px)] lg:pr-[calc(50vw-210px)]'
                  : 'px-4 sm:px-10 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
              }`}
            >
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`about-tl-card shrink-0 w-[82vw] max-w-[280px] sm:w-[380px] lg:w-[420px] ${
                    mode === 'swipe' ? 'snap-center' : ''
                  }`}
                >
                  <TiltCard
                    className="w-full h-[400px] xs:h-[420px] sm:h-[460px] lg:h-[480px]"
                    maxTilt={5}
                    scale={1.015}
                    delayMs={300}
                  >
                    <div className="relative w-full h-full rounded-3xl border border-neutral-800/80 bg-[#121212] overflow-hidden flex flex-col p-5 sm:p-7">
                      <div
                        aria-hidden="true"
                        className="absolute top-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute top-0 left-0 w-20 h-[2px] bg-gradient-to-r from-red-500 via-red-500/70 to-transparent"
                      />

                      <div className="relative z-10 flex items-start justify-between">
                        <span className="font-mono text-4xl sm:text-5xl font-black text-red-500 tracking-tight leading-none">
                          {milestone.year}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-600 tracking-widest pt-1">
                          {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="relative z-10 mt-5">
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase font-['Helvetica_Neue',Helvetica,Arial,sans-serif] leading-tight">
                          {milestone.title}
                        </h3>
                        <p className="text-[13px] text-neutral-400 mt-1.5 leading-snug">{milestone.summary}</p>
                      </div>

                      <p className="relative z-10 text-[13px] sm:text-sm text-gray-300 leading-relaxed mt-4">
                        {milestone.detail}
                      </p>

                      <dl className="relative z-10 mt-auto pt-4 border-t border-neutral-800 grid grid-cols-1 gap-y-2">
                        {milestone.facts.map((fact, fi) => (
                          <div key={`${fact.label}-${fi}`} className="flex items-baseline justify-between gap-2">
                            <dt className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                              {fact.label}
                            </dt>
                            <dd className="text-[13px] font-semibold text-gray-200 text-right">{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>

          {mode === 'carousel' && (
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-neutral-600 transition-opacity duration-500"
              style={{ opacity: hintVisible ? 1 : 0 }}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Keep scrolling</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots — mirrors the active card in both modes */}
      <div className="w-[min(1200px,calc(100%-32px))] sm:w-[min(1200px,calc(100%-80px))] mx-auto mt-6 sm:mt-8">
        <div className="flex items-center justify-center gap-2">
          {milestones.map((milestone, i) => (
            <button
              key={milestone.year}
              type="button"
              aria-label={`Jump to ${milestone.year}`}
              onClick={() => (mode === 'carousel' ? goTo(i) : cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }))}
              className="group py-2 cursor-pointer"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-6 bg-red-600' : 'w-1.5 bg-neutral-700 group-hover:bg-neutral-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;
