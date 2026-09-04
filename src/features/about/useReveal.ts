'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Minimal reveal-on-scroll primitive for the About dossier.
 *
 * Deliberately CSS-transition based rather than timeline driven: this page is
 * a reference document, so motion should confirm arrival and nothing more.
 * Honors prefers-reduced-motion by revealing immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = '-10% 0px -10% 0px') {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const node = ref.current;
    if (!node) return;

    // Never let motion hide content: reveal immediately when animation is
    // unwanted or when an observer could not work (no API, or a degenerate
    // zero-height viewport such as a hidden/headless frame).
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cannotObserve = !('IntersectionObserver' in window) || window.innerHeight === 0;

    if (reducedMotion || cannotObserve) {
      setIsVisible(true);
      return;
    }

    // Anything already on screen at mount reveals without waiting for a scroll.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible };
}

/** Shared transition classes for revealed blocks. */
export const revealBase = 'transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]';
export const revealHidden = 'opacity-0 translate-y-3';
export const revealShown = 'opacity-100 translate-y-0';

/** Stagger helper — keeps cascades short so scanning is never blocked. */
export const staggerDelay = (index: number, step = 45, max = 360) => ({
  transitionDelay: `${Math.min(index * step, max)}ms`,
});
