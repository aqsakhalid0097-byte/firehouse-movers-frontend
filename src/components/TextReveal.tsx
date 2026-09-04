'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export interface TextRevealProps {
  /** Tag to render — pass the heading's real semantic tag (h1/h2/h3/...). Defaults to 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  /** ScrollTrigger start position for when the reveal fires. Defaults to 'top 80%'. */
  start?: string;
  /** Per-character stagger, in seconds. Defaults to 0.028. */
  stagger?: number;
  /** Extra delay before the reveal starts, in seconds. Defaults to 0. */
  delay?: number;
}

/**
 * Lusion-style character reveal for section headings.
 *
 * Splits the wrapped heading into words, then characters within each word,
 * with GSAP SplitText (masked so each glyph appears to rise out from
 * underneath, clipped rather than just fading), then animates the
 * characters in with a fast, organic stagger the moment the heading scrolls
 * into view. Plays once per mount.
 *
 * Splitting by `words, chars` (rather than `chars` alone) and pinning each
 * word wrapper to `white-space: nowrap` keeps every word intact — the
 * browser can only insert a line break between word wrappers, never between
 * the individual masked character divs inside one word, no matter what
 * line-wrapping rules the surrounding heading styles apply.
 *
 * Rich children (nested colored/gradient spans) work fine — SplitText splits
 * text nodes in place without disturbing the surrounding markup, so a span
 * like `<span className="text-red-500">word</span>` keeps its own color
 * per-character.
 *
 * Renders the original text immediately on the server/first paint; the split
 * and animation only happen client-side after mount, so there is no
 * hydration mismatch. Respects prefers-reduced-motion by skipping the split
 * entirely and leaving the heading static and fully visible.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  as: Tag = 'div',
  className = '',
  children,
  start = 'top 80%',
  stagger = 0.028,
  delay = 0,
}) => {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = elRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      split = SplitText.create(el, {
        type: 'words, chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) => {
          self.words.forEach((word) => {
            const wordEl = word as HTMLElement;
            wordEl.style.whiteSpace = 'nowrap';
            wordEl.style.display = 'inline-block';
          });

          return gsap.from(self.chars, {
            yPercent: 115,
            opacity: 0,
            rotate: () => gsap.utils.random(-4, 4),
            duration: 1.25,
            ease: 'expo.out',
            stagger,
            delay,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          });
        },
      });
    }, elRef);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [start, stagger, delay]);

  const Component = Tag as React.ElementType;

  return (
    <Component ref={elRef} className={className}>
      {children}
    </Component>
  );
};

export default TextReveal;
