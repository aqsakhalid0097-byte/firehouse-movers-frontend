'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PARALLAX_PX = 24;
const TILT_DEG = 6.5;
const PUSH_PX = 16;
const LIFT_PX = 8;
const EASE_RATE = 7;

export interface HamzaServiceCardProps {
  index: number;
  title: string;
  body: string;
  image: string;
  alt: string;
  priority?: boolean;
}

export const HamzaServiceCard: React.FC<HamzaServiceCardProps> = ({
  index,
  title,
  body,
  image,
  alt,
  priority = false,
}) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Entrance animations for typography
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { y: -PARALLAX_PX },
          {
            y: PARALLAX_PX,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
        },
      });

      tl.from('[data-card-num]', {
        x: -12,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '[data-card-word]',
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
            stagger: 0.04,
          },
          '-=0.35'
        )
        .from(
          '[data-card-body]',
          { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.45'
        )
        .from(
          '[data-card-rule]',
          { scaleX: 0, duration: 0.65, ease: 'power3.out' },
          '-=0.5'
        );
    }, root);

    return () => ctx.revert();
  }, []);

  // Mouse 3D tilt, glare, and counter-shift (runs RAF only while hovered or settling)
  useEffect(() => {
    const frame = frameRef.current;
    const card = rootRef.current;
    if (!frame || !card) return;

    const to = { x: 0, y: 0, on: 0 };
    const at = { x: 0, y: 0, on: 0 };
    let raf = 0;
    let last = performance.now();
    let frameRect: DOMRect | null = null;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt * EASE_RATE);

      const settle = (from: number, targetVal: number) =>
        Math.abs(targetVal - from) < 0.001 ? targetVal : from + (targetVal - from) * k;

      at.x = settle(at.x, to.x);
      at.y = settle(at.y, to.y);
      at.on = settle(at.on, to.on);

      if (at.on > 0.001 || to.on > 0) {
        frame.style.transform = `perspective(1100px) rotateX(${(-at.y * TILT_DEG).toFixed(3)}deg) rotateY(${(at.x * TILT_DEG).toFixed(3)}deg) translate3d(0, ${(-at.on * LIFT_PX).toFixed(2)}px, 0)`;
        raf = requestAnimationFrame(tick);
      } else {
        frame.style.transform = '';
        raf = 0;
      }
    };

    const startTick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => {
      frameRect = frame.getBoundingClientRect();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!frameRect) frameRect = frame.getBoundingClientRect();
      to.x = ((e.clientX - frameRect.left) / frameRect.width - 0.5) * 2;
      to.y = ((e.clientY - frameRect.top) / frameRect.height - 0.5) * 2;
      to.on = 1;
      frame.style.setProperty('--mx', `${e.clientX - frameRect.left}px`);
      frame.style.setProperty('--my', `${e.clientY - frameRect.top}px`);
      startTick();
    };

    const onLeave = () => {
      frameRect = null;
      to.on = 0;
      to.x = 0;
      to.y = 0;
      startTick();
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <article ref={rootRef} className="group relative">
      <div
        ref={frameRef}
        data-ribbon-checkpoint=""
        className="relative aspect-4/3 origin-center overflow-hidden rounded-3xl ring-1 ring-white/10 transition-shadow duration-500 ease-out group-hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.95)]"
        style={{ '--mx': '50%', '--my': '50%' } as React.CSSProperties}
      >
        <Image
          ref={imgRef}
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 46vw, (min-width: 768px) 90vw, 100vw"
          className="scale-110 object-cover brightness-[0.82] saturate-[0.7] transition-[filter,scale] duration-700 ease-out group-hover:scale-[1.15] group-hover:brightness-105 group-hover:saturate-100"
        />

        {/* Ambient bottom gradient shade */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"
        />

        {/* Soft Red Glare Light Follower */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(400px circle at var(--mx) var(--my), rgba(239, 68, 68, 0.22), transparent 65%)',
          }}
        />

        {/* Left vertical red highlight bar on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-red-600 transition-transform duration-500 ease-out group-hover:scale-y-100"
        />

        {/* Step index badge */}
        <span
          data-card-num
          aria-hidden="true"
          className="absolute top-6 left-6 font-mono text-xs font-bold tracking-[0.25em] text-white/70 transition-colors duration-500 group-hover:text-red-400"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Dividing rule */}
      <div
        data-card-rule
        aria-hidden="true"
        className="mt-6 h-px w-full origin-left bg-white/10 transition-colors duration-500 group-hover:bg-red-500/60"
      />

      {/* Animated title */}
      <h3 className="mt-5 text-[clamp(1.5rem,2.2vw,2rem)] font-bold tracking-tight text-white transition-transform duration-500 ease-out group-hover:translate-x-1.5">
        {title.split(' ').map((word, i, all) => (
          <React.Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-card-word className="inline-block">
                <span
                  className="relative block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  <span className="block">{word}</span>
                  <span aria-hidden="true" className="absolute top-full left-0 block text-red-500">
                    {word}
                  </span>
                </span>
              </span>
            </span>
            {i < all.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </h3>

      {/* Description body */}
      <p
        data-card-body
        className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-neutral-400 transition-[transform,color] duration-500 ease-out group-hover:translate-x-1.5 group-hover:text-neutral-200"
      >
        {body}
      </p>
    </article>
  );
};

export default HamzaServiceCard;
