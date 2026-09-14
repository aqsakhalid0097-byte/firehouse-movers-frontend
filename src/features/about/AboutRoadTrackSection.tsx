'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TrackStatement {
  eyebrow: string;
  headline: string;
  lead: string;
  badge: string;
}

const STATEMENTS: TrackStatement[] = [
  {
    eyebrow: 'ORIGIN STORY',
    headline: 'Founded by Firefighters.',
    lead: 'We started in Lewisville with one truck and an operational code drilled in fire stations: protect the lives and belongings of the people who call on you.',
    badge: 'LEWISVILLE, TX • EST. 2004',
  },
  {
    eyebrow: 'CORE VALUES',
    headline: 'Pride. Honor. Integrity. Excellence.',
    lead: 'We don’t send whoever is free on a gig board. We send an accountable, drug-tested crew that has drilled heavy-lift physics together.',
    badge: 'FOUR COMMANDMENTS',
  },
  {
    eyebrow: 'MISSION DISCIPLINE',
    headline: 'One Crew. One Standard. Door to Door.',
    lead: 'The same faces loading the truck at 8am walk the empty rooms with you at dusk. Zero handoffs, zero shared cargo bays, and zero excuses.',
    badge: '100% CHAIN OF CUSTODY',
  },
];

export const AboutRoadTrackSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const roadPerspectiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Highway centerline dash flow with smooth inertia
      gsap.to('.road-dash-line', {
        strokeDashoffset: -1200,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // Subtle road perspective parallax
      if (roadPerspectiveRef.current) {
        gsap.to(roadPerspectiveRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }

      // Forward motion: Text starts distant, glides smoothly into focus, then softly passes overhead
      const items = gsap.utils.toArray<HTMLElement>('[data-road-text-card]');

      items.forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            end: 'bottom 15%',
            scrub: 0.8,
          },
        });

        // 1. Approach from distance: scale 0.78 -> 1.0, z -120 -> 0, y 70 -> 0, opacity 0 -> 1
        tl.fromTo(
          card,
          {
            scale: 0.78,
            opacity: 0,
            y: 70,
            z: -120,
            force3D: true,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            z: 0,
            duration: 0.45,
            ease: 'power1.out',
            force3D: true,
          }
        )
        // 2. Stable reading focal window
        .to(card, {
          scale: 1,
          opacity: 1,
          y: 0,
          z: 0,
          duration: 0.25,
          ease: 'none',
          force3D: true,
        })
        // 3. Smooth forward glide as user scrolls past
        .to(card, {
          scale: 1.04,
          opacity: 0.15,
          y: -35,
          z: 50,
          duration: 0.3,
          ease: 'power1.in',
          force3D: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative bg-black text-white py-24 sm:py-32 overflow-hidden border-t border-neutral-800"
      style={{ perspective: '1200px' }}
    >
      {/* 1. 3D Perspective Road Track in Background */}
      <div
        ref={roadPerspectiveRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(58deg) translateZ(-40px)',
        }}
      >
        {/* Converging highway perspective grid */}
        <div className="relative w-full max-w-5xl h-[2400px]">
          {/* Left Road Shoulder */}
          <div className="absolute top-0 bottom-0 left-[22%] w-[2px] bg-gradient-to-b from-transparent via-white/40 to-white/80" />
          {/* Right Road Shoulder */}
          <div className="absolute top-0 bottom-0 right-[22%] w-[2px] bg-gradient-to-b from-transparent via-white/40 to-white/80" />

          {/* Centerline Dashes */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="24 32"
              className="road-dash-line"
            />
          </svg>

          {/* Horizon glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-red-600/25 blur-[120px] rounded-full" />
        </div>
      </div>

      {/* 2. Content Corridor: Statements emerge toward the screen as you scroll */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 space-y-36 sm:space-y-48">
        {/* Section Lead Heading */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
            <span>THE HIGHWAY CORRIDOR</span>
          </div>

          <TextReveal as="h2" className="display-heading display-heading--section text-white leading-[0.92]" variant="flip">
            The road we built <br />
            <span className="text-red-500">our reputation on.</span>
          </TextReveal>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase pt-2">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-red-500" />
            <span>Scroll forward as the story approaches</span>
          </div>
        </div>

        {/* 3 Forward-Emerging Narrative Cards */}
        {STATEMENTS.map((stmt, idx) => (
          <div
            key={stmt.eyebrow}
            data-road-text-card
            className="group relative flex flex-col items-center text-center p-8 sm:p-14 rounded-3xl bg-neutral-950/85 border border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl will-change-transform transition-[border-color,box-shadow] duration-300 hover:border-red-500/40 hover:shadow-[0_40px_100px_-20px_rgba(239,68,68,0.2)]"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            {/* Top Red Glow Accent */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs font-bold text-red-500 tracking-[0.25em] uppercase">
                0{idx + 1} &middot; {stmt.eyebrow}
              </span>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.96]">
                {stmt.headline}
              </h3>

              <p className="text-neutral-300 text-base sm:text-xl leading-relaxed pt-2">
                {stmt.lead}
              </p>

              <div className="pt-6">
                <span className="inline-block font-mono text-xs text-neutral-400 border border-white/10 px-4 py-1.5 rounded-full bg-neutral-900/60">
                  {stmt.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutRoadTrackSection;
