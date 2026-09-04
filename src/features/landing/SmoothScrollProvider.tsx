'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const isReload = () => {
      try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
        }
        return (performance as unknown as { navigation?: { type?: number } }).navigation?.type === 1;
      } catch {
        return false;
      }
    };

    // If page was refreshed, always start from the top and wipe any lingering transition query/hash
    if (isReload()) {
      if (window.location.search.includes('from=about') || window.location.hash === '#estimate-calculator') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      try {
        sessionStorage.removeItem('scroll_to_bottom_on_landing');
      } catch {}
      delete (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom;
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      return () => {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    // If arriving from About page transition, immediately position at the last section (Proposal)
    const hasTransitionFlag =
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('scroll_to_bottom_on_landing') === 'true') ||
      (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom === true;
    const hasLegacyParams =
      window.location.search.includes('from=about') || window.location.hash === '#estimate-calculator';

    const isFromAbout = hasTransitionFlag || hasLegacyParams;

    if (isFromAbout) {
      try {
        sessionStorage.removeItem('scroll_to_bottom_on_landing');
      } catch {}
      delete (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom;

      // Clean the URL immediately so it never permanently alters the address bar or persists on refresh
      if (window.location.search.includes('from=about') || window.location.hash === '#estimate-calculator') {
        window.history.replaceState(null, '', window.location.pathname);
      }

      requestAnimationFrame(() => {
        lenis.scrollTo('#estimate-calculator', { immediate: true });
      });
      setTimeout(() => {
        lenis.scrollTo('#estimate-calculator', { immediate: true });
      }, 100);
      setTimeout(() => {
        lenis.scrollTo('#estimate-calculator', { immediate: true });
      }, 350);
    }

    // 3. Cleanup on Unmount
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
