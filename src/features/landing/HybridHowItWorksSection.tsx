'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Navigation } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// This section is pinned full-viewport-height while it plays (see the
// ScrollTrigger pin below), so its own box IS the whole screen for the
// entire time it's on screen - there's no internal scroll to reveal more
// of a tall gradient. Painting the transition directly into that fixed
// box is what makes it read as gradual rather than a hard cut: the top
// sliver fades in from black (matching the section above, and it's what's
// visible first as this section scrolls up into place before the pin
// engages), the large middle band - where the actual heading and cards
// sit, since they're vertically centered - is solid white, and the
// bottom sliver fades back to black (matching the section below, and it's
// what's visible once the pin releases and that section continues from
// underneath). The progress rail near the bottom edge deliberately keeps
// its original dark-on-dark styling untouched, since it sits inside that
// bottom black band rather than the white one.
const PROCESS_FIELD_STYLE: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #050505 0%, #ffffff 16%, #ffffff 84%, #050505 100%)',
};

const STAGES = [
  {
    step: '01',
    sn: 'STAGE 01',
    title: 'Walkthrough & quote',
    body: "We look at what's actually moving before we price it. Room by room, stairs counted, tight doorways noted, fragile items flagged. The number you get is the number you pay.",
    meta1: 'ON SITE OR VIDEO',
    meta2: '24 HR TURNAROUND',
  },
  {
    step: '02',
    sn: 'STAGE 02',
    title: 'Pack & protect',
    body: "Cartons sized to the contents, not to whatever's on the truck. Pads on the furniture, corners on the doorframes, floor runners down before a single item moves.",
    meta1: 'MATERIALS INCLUDED',
    meta2: 'DAY 0 PREP',
  },
  {
    step: '03',
    sn: 'STAGE 03',
    title: 'Load & secure',
    body: "Weight low and forward, straps every tier, nothing riding loose. A load that's packed right doesn't shift — which is most of what damage actually is.",
    meta1: 'CREW LEAD OWNS IT',
    meta2: 'DAY 1 LOAD',
  },
  {
    step: '04',
    sn: 'STAGE 04',
    title: 'Transit',
    body: "Fleet maintained on Ford Pro's service schedule with live telematics. You get the crew lead's number, not a call center, and an honest arrival window.",
    meta1: 'GPS TRACKED',
    meta2: 'LOCAL OR LONG DISTANCE',
  },
  {
    step: '05',
    sn: 'STAGE 05',
    title: 'Place & unpack',
    body: 'Furniture goes where you want it, not dumped inside the front door. Cartons opened, pads pulled, debris hauled out. We leave when every room is livable.',
    meta1: 'DEBRIS REMOVED',
    meta2: 'SAME DAY SETTLE',
  },
];

export const HybridHowItWorksSection: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const truckRef = useRef<HTMLDivElement | null>(null);

  // Lazy-initialize from the real viewport on the first client render so this
  // section's ScrollTrigger pin is created in the SAME mount pass as sibling
  // sections (e.g. MoveJourneyPinnedScroll below it). If this instead starts as
  // `false` and only flips to `true` after an effect + re-render, the next
  // section's ScrollTrigger can measure the document BEFORE this section's
  // ~4000px pin spacer has been inserted, caching a start position that's off
  // by roughly that amount -- which is exactly what made the journey section
  // take over while the cards were still mid-animation.
  const [isHorizontal, setIsHorizontal] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const checkMq = () => setIsHorizontal(mq.matches);
    mq.addEventListener('change', checkMq);
    return () => mq.removeEventListener('change', checkMq);
  }, []);

  useEffect(() => {
    if (!isHorizontal || !rootRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const root = rootRef.current!;

      const getTravelDistance = () => {
        if (!trackRef.current) return 2600;
        const cards = trackRef.current.querySelectorAll('article[data-process-card]');
        if (!cards || cards.length === 0) return 2600;
        const lastCard = cards[cards.length - 1] as HTMLElement;
        const trackRect = trackRef.current.getBoundingClientRect();
        const lastCardRect = lastCard.getBoundingClientRect();
        const currentX = (gsap.getProperty(trackRef.current, 'x') as number) || 0;
        
        // Un-transformed offset of the last card relative to track start
        const lastCardRight = (lastCardRect.right - currentX) - (trackRect.left - currentX);
        
        // Distance needed to bring the last card fully and comfortably into view
        const travel = lastCardRight - window.innerWidth + Math.round(window.innerWidth * 0.2);
        return Math.max(2400, Math.round(travel));
      };

      const cards = gsap.utils.toArray<HTMLElement>('[data-process-card]');
      const hover = cards.map(() => ({ x: 0, y: 0, on: 0, tx: 0, ty: 0, ton: 0 }));

      // Cache card horizontal center positions relative to the track
      let cardCenters: number[] = [];
      const updateCardPositions = () => {
        if (!trackRef.current) return;
        cardCenters = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
      };

      const updateCardHighlights = () => {
        if (!trackRef.current) return;
        const mid = window.innerWidth / 2;
        const currentX = (gsap.getProperty(trackRef.current, 'x') as number) || 0;

        cards.forEach((card, i) => {
          const baseCenter = cardCenters[i] ?? (card.offsetLeft + card.offsetWidth / 2);
          const visualCenter = baseCenter + currentX;
          const d = Math.abs(visualCenter - mid) / window.innerWidth;
          const t = gsap.utils.clamp(0, 1, 1 - d * 1.5);
          const h = hover[i];

          card.style.opacity = String(0.35 + t * 0.65 + h.on * 0.15);
          card.style.transform = `translate3d(0, ${(-h.on * LIFT).toFixed(1)}px, ${(h.on * 60).toFixed(1)}px) rotateX(${(-h.y * TILT).toFixed(2)}deg) rotateY(${(h.x * TILT).toFixed(2)}deg) scale(${(0.96 + t * 0.04).toFixed(3)})`;
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: true,
          anticipatePin: 0,
          start: 'top top',
          end: '+=4000',
          scrub: 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (truckRef.current) {
              truckRef.current.style.left = `${(self.progress * 100).toFixed(2)}%`;
            }
            updateCardHighlights();
          },
          onRefresh: () => {
            updateCardPositions();
            updateCardHighlights();
          },
        },
      });

      // Complete horizontal translation across all 5 stages and into the transition card
      tl.to(track, {
        x: () => -getTravelDistance(),
        ease: 'none',
        duration: 0.88,
      });

      // Settle buffer so the user can comfortably view Stage 05 and the transition finale
      tl.to(
        track,
        {
          x: () => -getTravelDistance() - 40,
          ease: 'power1.out',
          duration: 0.12,
        },
        0.88
      );

      // 3D Perspective Tilt on Cards (runs RAF loop only while actively hovered/settling)
      const TILT = 8;
      const LIFT = 18;
      let hoverRaf = 0;

      const tickHover = () => {
        let anyActive = false;
        cards.forEach((_, i) => {
          const h = hover[i];
          h.x += (h.tx - h.x) * 0.12;
          h.y += (h.ty - h.y) * 0.12;
          h.on += (h.ton - h.on) * 0.12;
          if (Math.abs(h.ton - h.on) < 0.001) {
            h.on = h.ton;
          }
          if (h.on > 0.0001 || h.ton > 0) {
            anyActive = true;
          }
        });
        updateCardHighlights();
        if (anyActive) {
          hoverRaf = requestAnimationFrame(tickHover);
        } else {
          hoverRaf = 0;
        }
      };

      const startHoverLoop = () => {
        if (!hoverRaf) {
          hoverRaf = requestAnimationFrame(tickHover);
        }
      };

      cards.forEach((card, i) => {
        const h = hover[i];
        let cardRect: DOMRect | null = null;

        const onEnter = () => {
          cardRect = card.getBoundingClientRect();
        };

        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          const rect = cardRect ?? card.getBoundingClientRect();
          cardRect = rect;
          if (!rect.width || !rect.height) return;
          h.tx = (e.clientX - rect.left) / rect.width - 0.5;
          h.ty = (e.clientY - rect.top) / rect.height - 0.5;
          h.ton = 1;
          startHoverLoop();
        };

        const onLeave = () => {
          cardRect = null;
          h.ton = 0;
          h.tx = 0;
          h.ty = 0;
          startHoverLoop();
        };

        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointermove', onMove as EventListener);
        card.addEventListener('pointerleave', onLeave as EventListener);
      });

      // Initial positions & card highlights
      updateCardPositions();
      updateCardHighlights();

      // Belt-and-suspenders: force ScrollTrigger to re-measure only if at top
      const refreshId = requestAnimationFrame(() => {
        if (typeof window !== 'undefined' && window.scrollY < 20) {
          ScrollTrigger.refresh();
        }
      });

      return () => {
        cancelAnimationFrame(refreshId);
        if (hoverRaf) cancelAnimationFrame(hoverRaf);
        tl.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [isHorizontal]);

  return (
    <section
      ref={rootRef}
      id="process"
      className="relative text-neutral-900 border-t border-neutral-800 w-full z-10"
      style={PROCESS_FIELD_STYLE}
    >
      <div className="md:flex md:h-screen md:flex-col md:justify-center py-24 md:py-0 relative overflow-hidden">
        {/* The Track: On desktop, the description and cards sit in the SAME LINE! */}
        <div
          ref={trackRef}
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-8 px-6 sm:px-10 lg:px-16 md:w-max md:pl-[6vw] md:pr-[16vw]"
        >
          {/* 1. Client-Style Description Block in the SAME line as the cards! */}
          <div className="shrink-0 w-full md:w-[clamp(22rem,30vw,32rem)] flex flex-col items-center justify-between p-8 sm:p-10 text-center md:h-[58vh]">
            <div className="space-y-4 flex flex-col items-center">
              <div className="inline-flex items-center text-red-600 font-mono text-xs font-bold tracking-[0.18em] uppercase">
                <span>THE PROCESS</span>
              </div>

              <TextReveal as="h2" className="display-heading display-heading--sub text-neutral-900 leading-[0.92]" variant="flip" wave={false}>
                The Firehouse <br />
                <span className="text-red-500">Method.</span>
              </TextReveal>

              <span aria-hidden="true" className="w-2 h-2 rounded-full border border-red-500/60" />

              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed pt-2 max-w-sm">
                Five disciplined stages, executed with precision. Keep scrolling to travel alongside your move from initial survey to placed furniture.
              </p>
            </div>

            <div className="pt-6 border-t border-black/10 flex items-center justify-between w-full text-xs font-mono text-neutral-500 uppercase">
              <div className="flex items-center gap-2 text-red-600">
                <Navigation className="w-4 h-4" />
                <span>Scroll to travel</span>
              </div>
              <span>5 Verified Stages</span>
            </div>
          </div>

          {/* 2. Hamza 3D Perspective Tilt Cards */}
          {STAGES.map((s, i) => (
            <article
              key={s.step}
              data-process-card
              style={{ transformStyle: 'preserve-3d' }}
              className="group relative isolate flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white p-8 sm:p-10 shadow-[0_14px_34px_-20px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow] duration-500 ease-out hover:border-red-500/50 hover:shadow-[0_30px_60px_-30px_rgba(239,68,68,0.22)] w-full md:w-[clamp(20rem,26vw,26rem)] md:h-[58vh]"
            >
              {/* Giant Translucent Step Number in Background */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl select-none"
              >
                <span className="absolute -right-4 -bottom-10 block font-mono text-[10rem] sm:text-[12rem] leading-none font-black text-black/[0.035] transition-colors duration-500 group-hover:text-red-500/[0.08]">
                  {s.step}
                </span>
              </span>

              {/* Red Edge along Top on Hover */}
              <span
                aria-hidden="true"
                className="bg-red-600 absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />

              {/* Card Top Content */}
              <div>
                <span className="font-mono text-xs font-bold text-red-600 tracking-widest uppercase">
                  {s.sn}
                </span>
                <h3 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 uppercase">
                  {s.title}
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">
                  {s.body}
                </p>
              </div>

              {/* Card Bottom Meta Badges */}
              <div className="pt-6 border-t border-black/[0.08]">
                <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
                  <span className="bg-neutral-100 px-2.5 py-1 rounded-md border border-black/5 text-neutral-600">
                    {s.meta1}
                  </span>
                  <span className="text-red-600 font-semibold">{s.meta2}</span>
                </div>
              </div>
            </article>
          ))}

          {/* 3. Transition Finale Card: Connected bridge into Live Dispatch Wavelength */}
          <article
            data-process-card
            style={{ transformStyle: 'preserve-3d' }}
            className="group relative isolate flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-b from-red-950/40 via-neutral-900/90 to-black p-8 sm:p-10 shadow-[0_20px_50px_-20px_rgba(239,68,68,0.3)] transition-[border-color,box-shadow] duration-500 ease-out hover:border-red-400 w-full md:w-[clamp(20rem,26vw,26rem)] md:h-[58vh]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl select-none"
            >
              <span className="absolute -right-4 -bottom-10 block font-mono text-[10rem] sm:text-[12rem] leading-none font-black text-red-500/[0.04] transition-colors duration-500 group-hover:text-red-500/[0.08]">
                06
              </span>
            </span>

            <span
              aria-hidden="true"
              className="bg-red-500 absolute inset-x-0 top-0 h-[3px] origin-left scale-x-100 transition-transform duration-500 ease-out"
            />

            <div>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-mono text-[11px] font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                EXECUTION PHASE
              </span>
              <h3 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-white uppercase leading-snug">
                Move Wavelength <br />
                <span className="text-red-500">Live Console.</span>
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                All 5 stages link seamlessly to our active chain-of-custody dispatch console. Continue scrolling to engage the real-time telematics wave.
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between font-mono text-[11px] text-red-400 font-bold">
                <span className="bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-md">
                  NEXT SECTION
                </span>
                <span className="flex items-center gap-1.5 animate-pulse">
                  Scroll into Wave ↓
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Route Progress Rail with Moving Truck */}
        <div className="hidden md:block absolute bottom-8 left-16 right-16 z-20">
          <div className="relative h-1.5 w-full bg-neutral-800/80 rounded-full overflow-visible">
            {/* Active Red Track */}
            <div
              ref={progressRef}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full origin-left scale-x-0"
              style={{ transform: 'scaleX(0)' }}
            />

            {/* Traveling Truck Glyph */}
            <div
              ref={truckRef}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
              style={{ left: '0%' }}
            >
              <svg width="28" height="18" viewBox="0 0 32 22" fill="none">
                <rect x="0" y="3" width="21" height="16" rx="2" fill="#ffffff" />
                <rect x="20" y="1" width="12" height="20" rx="3" fill="#ef4444" />
                <rect x="28" y="5" width="3" height="12" rx="1.5" fill="#0A0A0C" />
                <rect x="2" y="0" width="15" height="3" rx="1.5" fill="#0A0A0C" />
                <rect x="2" y="19" width="15" height="3" rx="1.5" fill="#0A0A0C" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HybridHowItWorksSection;
