'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AnimatedHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  text: string;
  gradientText?: string;
  badge?: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  scrollTrigger?: boolean;
  toggleActions?: string;
  delay?: number;
  /** Ultra-light uppercase display treatment used on marketing sections. */
  display?: boolean;
}

/**
 * Kinetic heading primitive used across hero / section headings.
 * Strictly themed to red, black, white and grey — no other hues.
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  as: Component = 'h1',
  text,
  gradientText,
  badge,
  subtitle,
  className = '',
  align = 'left',
  scrollTrigger = false,
  toggleActions = 'restart none none reset',
  delay = 0,
  display = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        ['.anim-heading-badge', '.anim-heading-word', '.anim-gradient-word', '.anim-heading-sub'],
        { clearProps: 'all' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: scrollTrigger
          ? {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions,
            }
          : undefined,
      });

      // 1. Badge slide-in
      if (badge) {
        tl.fromTo(
          '.anim-heading-badge',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }

      // 2. Kinetic word reveal
      tl.fromTo(
        '.anim-heading-word',
        { yPercent: 110, rotate: 2, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.04,
          ease: 'power4.out',
        },
        badge ? '-=0.3' : 0
      );

      // 3. Gradient text reveal with scale pop
      if (gradientText) {
        tl.fromTo(
          '.anim-gradient-word',
          { yPercent: 110, opacity: 0, scale: 0.95 },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power4.out',
          },
          '-=0.7'
        );
      }

      // 4. Subtitle fade up
      if (subtitle) {
        tl.fromTo(
          '.anim-heading-sub',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.5'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [badge, delay, gradientText, scrollTrigger, subtitle, toggleActions]);

  const alignmentClass =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : align === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const plainWords = text.split(' ').filter(Boolean);
  const gradWords = gradientText ? gradientText.split(' ').filter(Boolean) : [];

  return (
    <div ref={containerRef} className={`flex flex-col ${alignmentClass} ${className}`}>
      {/* Optional Top Badge / Mono Kicker */}
      {badge && (
        <div className="anim-heading-badge inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono font-bold text-xs uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      {/* Kinetic Animated Heading */}
      <Component
        className={
          display
            ? 'display-heading display-heading--section text-white'
            : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]'
        }
      >
        <span className="inline-block overflow-hidden pb-1">
          {plainWords.map((word, idx) => (
            <span
              key={idx}
              className="anim-heading-word inline-block mr-[0.28em] will-change-transform"
            >
              {word}
            </span>
          ))}
        </span>

        {gradientText && (
          <>
            <br className="hidden sm:inline" />
            <span className="inline-block overflow-hidden pb-2">
              {gradWords.map((gWord, gIdx) => (
                <span
                  key={gIdx}
                  className="anim-gradient-word inline-block mr-[0.28em] bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text will-change-transform"
                >
                  {gWord}
                </span>
              ))}
            </span>
          </>
        )}
      </Component>

      {/* Optional Subtitle */}
      {subtitle && (
        <p className="anim-heading-sub text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AnimatedHeading;
