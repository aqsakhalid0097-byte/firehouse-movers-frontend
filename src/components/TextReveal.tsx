'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Entrance styles, ported from the hamza-firhouse-frontend reference's own
 * RevealText. Every heading on this site previously used the same single
 * rise-up effect (or nothing at all), which reads as one effect repeating
 * rather than a sequence of moments - each section can now pick its own.
 */
export type RevealVariant = 'flip' | 'rise' | 'fall' | 'wipe';

export interface TextRevealProps {
  /** Tag to render — pass the heading's real semantic tag (h1/h2/h3/...). Defaults to 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  /** ScrollTrigger start position used as a fallback when this heading is
   *  not inside a pinned container (see `pinnedContainer` handling below). */
  start?: string;
  /** Overrides the automatic per-heading stagger spread (in seconds). Left
   *  unset, longer headings get a proportionally wider cascade instead of
   *  every character waiting on a fixed interval. */
  stagger?: number;
  /** Extra delay before the reveal starts, in seconds. Defaults to 0. */
  delay?: number;
  /** Entrance style - see RevealVariant. Defaults to 'flip'. */
  variant?: RevealVariant;
  /** Scroll-driven word wave + a velocity skew lean on the whole line while
   *  the heading is on screen, layered on top of the entrance. Defaults on;
   *  pass false for a heading that should only get the entrance. */
  wave?: boolean;
}

/**
 * Character reveal for section headings, in the style of the
 * hamza-firhouse-frontend reference's RevealText: a per-character entrance
 * (pick from four variants), a slow scroll-driven word wave and velocity
 * skew lean while the heading stays on screen, and a replay every time the
 * heading re-enters the viewport rather than a once-per-mount animation.
 *
 * Built on top of GSAP SplitText rather than Hamza's hand-rolled per-word/
 * per-character markup, because SplitText splits arbitrary rich children
 * (nested colored/gradient spans, manual <br/> line breaks) in place
 * without disturbing them - which is exactly the two-line "white line,
 * <br/>, red accent line" shape most of this site's headings already use,
 * and which Hamza's plain-string-only API couldn't reproduce without
 * flattening every heading down to a single auto-picked trailing accent
 * word.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  as: Tag = 'div',
  className = '',
  children,
  start = 'top 80%',
  stagger,
  delay = 0,
  variant = 'flip',
  wave = true,
}) => {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = elRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let split: SplitText | null = null;
    const cleanups: (() => void)[] = [];

    // A heading inside a horizontally-pinned track (this site's own process
    // section scroll-jacks a row of cards the same way) sits visually still
    // while the page scrolls underneath it, so a scrollTrigger computed from
    // the element's position in the *document* believes a heading sitting in
    // full view has already been scrolled past. An IntersectionObserver
    // asks the browser what's actually on screen, which stays true
    // regardless of what's pinning what, so the entrance below is driven by
    // that instead of a scrollTrigger on the tween itself.
    const pinnedContainer =
      (el.closest('[data-pinned-container]') as HTMLElement | null) ?? undefined;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words, chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) => {
          const words = self.words as HTMLElement[];
          const chars = self.chars as HTMLElement[];

          words.forEach((word) => {
            word.style.whiteSpace = 'nowrap';
            word.style.display = 'inline-block';
          });

          // The flip variant rotates each character in depth, which needs
          // `perspective` on a non-clipping ancestor - SplitText's own
          // per-character mask has `overflow: hidden`, and perspective set
          // on a clipped element is silently discarded (measured: the
          // rotation collapsed into a flat vertical squash). Wrapping each
          // char in one extra inline-block span between the mask and the
          // glyph gives the rotation somewhere to actually carry depth.
          if (variant === 'flip') {
            chars.forEach((charEl) => {
              const wrapper = document.createElement('span');
              wrapper.style.display = 'inline-block';
              wrapper.style.perspective = '520px';
              charEl.parentElement?.insertBefore(wrapper, charEl);
              wrapper.appendChild(charEl);
            });
          }

          // `amount` rather than a fixed per-character interval, and
          // capped: the cascade should read as one gesture travelling
          // along the line, not one that takes proportionally longer for
          // every extra character in a long heading.
          const spread = stagger ?? Math.min(0.42, chars.length * 0.016);

          const entrances: Record<RevealVariant, gsap.TweenVars> = {
            flip: {
              yPercent: 120,
              rotateX: -92,
              opacity: 0,
              duration: 0.85,
              ease: 'expo.out',
              transformOrigin: '50% 100%',
              stagger: { amount: spread, from: 'start', ease: 'power2.in' },
            },
            rise: {
              yPercent: 110,
              opacity: 0,
              duration: 0.7,
              ease: 'power4.out',
              stagger: { amount: spread * 0.8, from: 'start' },
            },
            fall: {
              yPercent: -110,
              scale: 1.3,
              opacity: 0,
              duration: 0.8,
              ease: 'back.out(1.4)',
              transformOrigin: '50% 50%',
              stagger: { amount: spread * 1.1, from: 'center' },
            },
            wipe: {
              xPercent: -60,
              opacity: 0,
              duration: 0.62,
              ease: 'power3.out',
              stagger: { amount: spread * 0.9, from: 'start' },
            },
          };

          const tl = gsap.timeline({ paused: true });
          tl.from(chars, { ...entrances[variant], delay });
          tl.pause(0);

          // Play/reset driven by an IntersectionObserver rather than a
          // once-per-mount scrollTrigger, so a heading replays every time
          // it comes back into view instead of showing nothing the second
          // time someone scrolls up and back down past it.
          const io = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) tl.restart(true);
                else tl.pause(0);
              }
            },
            { rootMargin: '-6% 0px -6% 0px', threshold: 0 },
          );
          io.observe(el);
          cleanups.push(() => io.disconnect());

          if (wave) {
            // Each word drifts upward as the heading crosses the viewport,
            // staggered so the movement travels along the line as a wave
            // rather than the whole line sliding as one rigid block.
            gsap.to(words, {
              y: -16,
              ease: 'none',
              stagger: { each: 0.05, from: 'start' },
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                pinnedContainer,
                scrub: 0.6,
              },
            });

            // The line itself leans into the scroll, then springs back.
            // Skew is driven by scroll *velocity*, not position, and is
            // always chasing back to 0 - so at rest every heading sits
            // perfectly straight, and the lean only ever shows up as a
            // response to how hard the reader throws the page.
            const spring = { skew: 0 };
            const setSkew = gsap.quickSetter(el, 'skewY', 'deg');
            const clampSkew = gsap.utils.clamp(-5, 5);
            ScrollTrigger.create({
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              pinnedContainer,
              onUpdate: (self2) => {
                const target = clampSkew(self2.getVelocity() / -420);
                if (Math.abs(target) <= Math.abs(spring.skew)) return;
                spring.skew = target;
                gsap.to(spring, {
                  skew: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  overwrite: true,
                  onUpdate: () => setSkew(spring.skew),
                });
              },
            });
          }
        },
      });
    }, elRef);

    return () => {
      cleanups.forEach((fn) => fn());
      split?.revert();
      ctx.revert();
    };
  }, [start, stagger, delay, variant, wave]);

  const Component = Tag as any;

  return (
    <Component ref={elRef} className={className}>
      {children}
    </Component>
  );
};

export default TextReveal;
