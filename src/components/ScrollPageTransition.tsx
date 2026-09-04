'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const THRESHOLD = 320; // Required accumulated scroll delta

export const ScrollPageTransition: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [showIndicator, setShowIndicator] = useState<boolean>(false);
  const [indicatorType, setIndicatorType] = useState<'down' | 'up'>('down');
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  // Transition cover states: 'idle' | 'covered' | 'leaving'
  const [coverPhase, setCoverPhase] = useState<'idle' | 'covered' | 'leaving'>('idle');
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<'ABOUT' | 'MAIN'>('ABOUT');

  const lockedRef = useRef<boolean>(false);
  const accumRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const touchYRef = useRef<number>(0);

  // Determine eligible pages
  const isProposalPage = pathname === '/' || pathname === '/landing';
  const isAboutPage = pathname === '/about';

  // Smooth progress interpolation & idle decay loop
  // If the user stops scrolling before 100%, the pillars smoothly fall back down
  useEffect(() => {
    let animId: number;
    const updateLoop = () => {
      const now = Date.now();

      // 1. If user stopped scrolling before reaching threshold, decay progress back down
      if (!lockedRef.current && accumRef.current > 0 && accumRef.current < THRESHOLD) {
        if (now - lastScrollTimeRef.current > 130) {
          accumRef.current = Math.max(0, accumRef.current - 10);
          setTargetProgress(accumRef.current / THRESHOLD);
        }
      }

      // 2. Smoothly lerp displayProgress towards targetProgress
      setDisplayProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.004) return targetProgress;
        return prev + diff * 0.24;
      });

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [targetProgress]);

  // Handle positioning when landing on Main from About
  useEffect(() => {
    if (isProposalPage && typeof window !== 'undefined') {
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

      if (isReload()) {
        if (window.location.search.includes('from=about') || window.location.hash === '#estimate-calculator') {
          window.history.replaceState(null, '', window.location.pathname);
        }
        try {
          sessionStorage.removeItem('scroll_to_bottom_on_landing');
        } catch {}
        delete (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom;
        window.scrollTo(0, 0);
        return;
      }

      const hasTransitionFlag =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('scroll_to_bottom_on_landing') === 'true') ||
        (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom === true;
      const urlParams = new URLSearchParams(window.location.search);
      const isFromAbout =
        hasTransitionFlag ||
        urlParams.get('from') === 'about' ||
        window.location.hash === '#estimate-calculator';

      if (isFromAbout) {
        try {
          sessionStorage.removeItem('scroll_to_bottom_on_landing');
        } catch {}
        delete (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom;

        if (window.location.search.includes('from=about') || window.location.hash === '#estimate-calculator') {
          window.history.replaceState(null, '', window.location.pathname);
        }

        const scrollToBottom = () => {
          const el = document.getElementById('estimate-calculator');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'end' });
          } else {
            window.scrollTo(0, document.documentElement.scrollHeight);
          }
        };
        requestAnimationFrame(scrollToBottom);
        const timer1 = setTimeout(scrollToBottom, 60);
        const timer2 = setTimeout(scrollToBottom, 200);
        const timer3 = setTimeout(scrollToBottom, 500);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
  }, [isProposalPage]);

  // Execute transition
  const executeTransition = useCallback((direction: 'to-about' | 'to-main') => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setShowIndicator(false);

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (direction === 'to-about') {
      setTransitionLabel('ABOUT');
    } else {
      setTransitionLabel('MAIN');
    }

    if (prefersReducedMotion) {
      if (direction === 'to-about') {
        router.push('/about');
      } else {
        try {
          sessionStorage.setItem('scroll_to_bottom_on_landing', 'true');
        } catch {}
        (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom = true;
        router.push('/');
      }
      accumRef.current = 0;
      setTargetProgress(0);
      setDisplayProgress(0);
      lockedRef.current = false;
      return;
    }

    // Phase 1: All pillars reach top and fully cover screen
    setCoverPhase('covered');
    setShowLabel(true);

    if (direction === 'to-about') {
      router.push('/about');
    } else {
      try {
        sessionStorage.setItem('scroll_to_bottom_on_landing', 'true');
      } catch {}
      (window as unknown as { __transitionToBottom?: boolean }).__transitionToBottom = true;
      router.push('/');
    }

    // Phase 2: Hide label & position target page underneath solid red
    const t1 = setTimeout(() => {
      setShowLabel(false);

      if (direction === 'to-about') {
        window.scrollTo(0, 0);
      } else {
        const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        window.scrollTo(0, docH);
        const el = document.getElementById('estimate-calculator');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'end' });
      }
    }, 450);

    // Phase 3: Pillars animate upward off-screen with staggered reveal
    const t2 = setTimeout(() => {
      setCoverPhase('leaving');
    }, 560);

    // Phase 4: Complete transition & reset to idle
    const t3 = setTimeout(() => {
      setCoverPhase('idle');
      accumRef.current = 0;
      setTargetProgress(0);
      setDisplayProgress(0);
      lockedRef.current = false;
    }, 1150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  // Main scroll, wheel, and boundary monitoring
  useEffect(() => {
    if (typeof window === 'undefined' || (!isProposalPage && !isAboutPage)) {
      setShowIndicator(false);
      accumRef.current = 0;
      setTargetProgress(0);
      return;
    }

    const checkBoundary = () => {
      if (lockedRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowH = window.innerHeight;
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight
      );

      if (isProposalPage) {
        const isAtBottom = windowH + scrollY >= docH - 45;
        if (isAtBottom) {
          setShowIndicator(true);
          setIndicatorType('down');
        } else {
          setShowIndicator(false);
          if (accumRef.current > 0) {
            accumRef.current = 0;
            setTargetProgress(0);
          }
        }
      } else if (isAboutPage) {
        const isAtTop = scrollY <= 15;
        if (isAtTop) {
          setShowIndicator(true);
          setIndicatorType('up');
        } else {
          setShowIndicator(false);
          if (accumRef.current > 0) {
            accumRef.current = 0;
            setTargetProgress(0);
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (lockedRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowH = window.innerHeight;
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      // 1. Proposal -> About (At bottom, scrolling downwards)
      if (isProposalPage) {
        const isAtBottom = windowH + scrollY >= docH - 45;
        if (isAtBottom && e.deltaY > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.min(THRESHOLD, Math.max(0, accumRef.current + e.deltaY));
          const p = accumRef.current / THRESHOLD;
          setTargetProgress(p);
          if (accumRef.current >= THRESHOLD) {
            executeTransition('to-about');
          }
        } else if (isAtBottom && e.deltaY < 0 && accumRef.current > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.max(0, accumRef.current + e.deltaY);
          setTargetProgress(accumRef.current / THRESHOLD);
        }
      }

      // 2. About -> Main (At top, scrolling upwards)
      if (isAboutPage) {
        const isAtTop = scrollY <= 15;
        if (isAtTop && e.deltaY < 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.min(THRESHOLD, Math.max(0, accumRef.current + Math.abs(e.deltaY)));
          const p = accumRef.current / THRESHOLD;
          setTargetProgress(p);
          if (accumRef.current >= THRESHOLD) {
            executeTransition('to-main');
          }
        } else if (isAtTop && e.deltaY > 0 && accumRef.current > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.max(0, accumRef.current - e.deltaY);
          setTargetProgress(accumRef.current / THRESHOLD);
        }
      }
    };

    // Touch events for mobile/tablet gestures
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (lockedRef.current || !e.touches || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchYRef.current - currentY;
      touchYRef.current = currentY;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowH = window.innerHeight;
      const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

      if (isProposalPage) {
        const isAtBottom = windowH + scrollY >= docH - 45;
        if (isAtBottom && deltaY > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.min(THRESHOLD, Math.max(0, accumRef.current + deltaY * 2.2));
          const p = accumRef.current / THRESHOLD;
          setTargetProgress(p);
          if (accumRef.current >= THRESHOLD) {
            executeTransition('to-about');
          }
        } else if (isAtBottom && deltaY < 0 && accumRef.current > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.max(0, accumRef.current + deltaY * 2.2);
          setTargetProgress(accumRef.current / THRESHOLD);
        }
      } else if (isAboutPage) {
        const isAtTop = scrollY <= 15;
        if (isAtTop && deltaY < 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.min(THRESHOLD, Math.max(0, accumRef.current + Math.abs(deltaY) * 2.2));
          const p = accumRef.current / THRESHOLD;
          setTargetProgress(p);
          if (accumRef.current >= THRESHOLD) {
            executeTransition('to-main');
          }
        } else if (isAtTop && deltaY > 0 && accumRef.current > 0) {
          lastScrollTimeRef.current = Date.now();
          accumRef.current = Math.max(0, accumRef.current - deltaY * 2.2);
          setTargetProgress(accumRef.current / THRESHOLD);
        }
      }
    };

    window.addEventListener('scroll', checkBoundary, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    checkBoundary();

    return () => {
      window.removeEventListener('scroll', checkBoundary);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isProposalPage, isAboutPage, executeTransition]);

  // Render only on Proposal or About, or during active interaction
  if (!isProposalPage && !isAboutPage && coverPhase === 'idle' && displayProgress <= 0) {
    return null;
  }

  // Calculate pillar translateY for each of the 5 strips
  // Strips rise from left (0) to right (4) as progress builds
  // When scrolling stops, they smoothly sink back down
  const getPillarTranslateY = (index: number) => {
    if (coverPhase === 'leaving') return -100;
    if (coverPhase === 'covered') return 0;
    if (displayProgress <= 0) return 100;

    const start = (index / 5) * 0.44;
    const end = start + 0.56;
    const p = Math.min(1, Math.max(0, (displayProgress - start) / (end - start)));
    const eased = p * p * (3 - 2 * p);
    return (1 - eased) * 100;
  };

  const pillClass = indicatorType === 'down'
    ? `scroll-boundary-pill pos-bottom ${showIndicator && coverPhase === 'idle' ? 'visible' : ''}`
    : `scroll-boundary-pill pos-top ${showIndicator && coverPhase === 'idle' ? 'visible' : ''}`;

  const coverClass = `banner-cover ${
    coverPhase === 'leaving'
      ? 'phase-leaving'
      : coverPhase === 'covered'
      ? 'phase-covered'
      : ''
  }`;

  const isCoverActive = coverPhase !== 'idle' || displayProgress > 0.01;

  return (
    <>
      {/* 1. Subtle Boundary Progress Indicator Badge */}
      <div className={pillClass} aria-hidden={!showIndicator}>
        <span className="pill-text">
          {indicatorType === 'down' ? 'SCROLL TO EXPLORE — ABOUT' : 'SCROLL TO RETURN — MAIN'}
        </span>
        <div className="pill-track">
          <div
            className="pill-bar"
            style={{ width: `${Math.min(100, Math.max(0, displayProgress * 100))}%` }}
          />
        </div>
      </div>

      {/* 2. Full-Width 5-Panel Red Pillars Rising from Left to Right */}
      {isCoverActive && (
        <div className={coverClass}>
          {[0, 1, 2, 3, 4].map((idx) => {
            const transY = getPillarTranslateY(idx);
            return (
              <div
                key={idx}
                className="banner-panel"
                style={{
                  transform: coverPhase === 'leaving' ? undefined : `translateY(${transY}%)`,
                  transition: coverPhase === 'idle' ? 'none' : undefined,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3. Masked Center Title Reveal */}
      <div className={`banner-label-overlay ${showLabel ? 'active' : ''}`}>
        <div className="banner-label-text">
          <span>{transitionLabel}</span>
        </div>
      </div>
    </>
  );
};

export default ScrollPageTransition;
