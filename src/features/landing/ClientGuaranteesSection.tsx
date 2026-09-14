'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Clock, Award, CheckCircle2, FileText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from '@/components/TextReveal';
import { TiltCard } from '@/components/TiltCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GUARANTEES = [
  {
    title: 'Fast Moves & Sized Crews',
    body: 'Crews sized to the real scale of your home so your move finishes in a single day, not dragged out across a weekend.',
    image: '/images/two_trucks.jpg',
    badge: 'DAY 1 COMPLETION',
  },
  {
    title: 'Disciplined Safe Handling',
    body: 'Every item padded with heavy quilted blankets, shrink-wrapped, and strapped to wall E-track rails before the truck rolls an inch.',
    image: '/images/packing.jpg',
    badge: 'ZERO SHOCK PADDING',
  },
  {
    title: 'Guaranteed Arrival Window',
    body: 'A firm arrival window committed in writing. You receive direct lead contact and real-time GPS telemetry throughout transit.',
    image: '/images/local.jpg',
    badge: 'ON-TIME COMMITTED',
  },
];

/** Stroke width of the asphalt road surface in CSS pixels. */
const ROAD_WIDTH = 22;

/**
 * Normalized waypoints entering from top-right and exiting at bottom-left,
 * sweeping through open negative space and around the guarantee cards.
 */
const ROAD_WAYPOINTS_TR_TO_BL: readonly [number, number][] = [
  [1.15, 0.05],
  [0.86, 0.16],
  [0.72, 0.38],
  [0.55, 0.58],
  [0.32, 0.76],
  [0.10, 0.90],
  [-0.15, 0.98],
];

/**
 * Chaikin corner-cutting for smooth spline interpolation.
 */
function chaikin(pts: readonly (readonly [number, number])[]): [number, number][] {
  if (pts.length < 3) return pts.map((p) => [p[0], p[1]] as [number, number]);
  const out: [number, number][] = [[pts[0][0], pts[0][1]]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
    out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push([pts[pts.length - 1][0], pts[pts.length - 1][1]]);
  return out;
}

/**
 * Builds centripetal Catmull-Rom spline through waypoints.
 */
function buildPath(
  w: number,
  h: number,
  waypoints: readonly (readonly [number, number])[]
): string {
  if (w <= 0 || h <= 0 || waypoints.length < 2) return '';
  const scaled = waypoints.map(([fx, fy]) => [fx * w, fy * h] as [number, number]);
  const pts = chaikin(chaikin(scaled));
  if (pts.length < 2) return '';

  const dist = (a: readonly number[], b: readonly number[]) =>
    Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5;

  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const d1 = dist(p0, p1) || 1;
    const d2 = dist(p1, p2) || 1;
    const d3 = dist(p2, p3) || 1;

    const c1: [number, number] = [0, 0];
    const c2: [number, number] = [0, 0];
    for (let k = 0; k < 2; k++) {
      c1[k] =
        (d1 * d1 * p2[k] -
          d2 * d2 * p0[k] +
          (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) /
        (3 * d1 * (d1 + d2));
      c2[k] =
        (d3 * d3 * p1[k] -
          d2 * d2 * p3[k] +
          (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) /
        (3 * d3 * (d3 + d2));
    }
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

export const ClientGuaranteesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);

  // SVG road layer refs
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);
  const edgePathRef = useRef<SVGPathElement | null>(null);
  const maskPathRef = useRef<SVGPathElement | null>(null);
  const truckMarkerRef = useRef<SVGGElement | null>(null);
  const truckFlipRef = useRef<SVGGElement | null>(null);

  const [dims, setDims] = useState({ width: 1440, height: 950 });

  // Measure section dimensions
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    const el = sectionRef.current;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setDims((prev) => {
        if (Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1) {
          return prev;
        }
        return { width: rect.width, height: rect.height };
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const roadPathD = useMemo(() => {
    return buildPath(dims.width, dims.height, ROAD_WAYPOINTS_TR_TO_BL);
  }, [dims.width, dims.height]);

  // Entrance animations for headline and cards
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }

      if (cardsGridRef.current) {
        gsap.fromTo(
          Array.from(cardsGridRef.current.children),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Motion physics: scroll reveal with 0.2 momentum chase & tangent truck heading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = sectionRef.current;
    const path = pathRef.current;
    const truck = truckMarkerRef.current;
    if (!el || !path || dims.width === 0) return;

    let length = 0;
    try {
      length = path.getTotalLength() || 0;
    } catch {
      length = 0;
    }
    if (length <= 10) return;

    const revealed = [
      path,
      maskPathRef.current,
      glowPathRef.current,
      edgePathRef.current,
    ].filter((p): p is SVGPathElement => p !== null);

    revealed.forEach((p) => {
      p.style.strokeDasharray = `${length}`;
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealed.forEach((p) => {
        p.style.strokeDashoffset = '0';
      });
      if (truck) {
        const end = path.getPointAtLength(length);
        truck.setAttribute('transform', `translate(${end.x} ${end.y})`);
        truck.style.opacity = '1';
      }
      return;
    }

    let raf = 0;
    let at = -1;

    const tick = () => {
      const r = el.getBoundingClientRect();
      const pageTop = r.top + window.scrollY;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      const half = window.innerHeight * 0.5;
      const from = pageTop - half;
      const to = Math.min(pageTop + r.height - half, maxScroll);
      const span = Math.max(1, to - from);
      const want = length * Math.min(1, Math.max(0, (window.scrollY - from) / span));

      if (at < 0) {
        at = want;
      } else {
        at += (want - at) * 0.2;
      }
      const progress = Math.min(1, Math.max(0, at / (length || 1)));

      const offset = `${length * (1 - progress)}`;
      revealed.forEach((p) => {
        p.style.strokeDashoffset = offset;
      });

      if (truck) {
        const d = length * progress;
        const pt = path.getPointAtLength(d);

        // 2-point central difference tangent calculation
        const back = path.getPointAtLength(Math.max(0, d - 2));
        const fwd = path.getPointAtLength(Math.min(length, d + 2));
        const angle = (Math.atan2(fwd.y - back.y, fwd.x - back.x) * 180) / Math.PI;

        truck.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${angle.toFixed(2)})`
        );

        // Keep truck upright when heading leftwards
        if (truckFlipRef.current) {
          const isFlipped = Math.cos((angle * Math.PI) / 180) < 0;
          truckFlipRef.current.setAttribute('transform', isFlipped ? 'scale(1, -1)' : 'scale(1, 1)');
        }

        const screenY = r.top + pt.y;
        const onScreen =
          pt.x > -60 &&
          pt.x < dims.width + 60 &&
          screenY > -60 &&
          screenY < window.innerHeight + 60;
        truck.style.opacity = progress > 0.005 && progress < 0.999 && onScreen ? '1' : '0';
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dims.width, dims.height, roadPathD]);

  return (
    <section
      ref={sectionRef}
      id="guarantees"
      className="relative bg-[#0b0b0e] text-white py-28 px-6 sm:px-10 lg:px-16 border-t border-neutral-800 overflow-hidden"
    >
      {/* Dynamic Hamza SVG Asphalt Road Ribbon (Top-Right to Bottom-Left) */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* Revealed road mask */}
          <mask id="guaranteesRoadMask">
            <path
              ref={maskPathRef}
              d={roadPathD}
              stroke="#ffffff"
              strokeWidth={ROAD_WIDTH + 6}
              strokeLinecap="round"
              fill="none"
            />
          </mask>

          {/* Truck soft red under-glow filter */}
          <filter id="truckHaloFilterGuarantees" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
          </filter>
        </defs>

        {/* Soft under-glow for depth */}
        <path
          ref={glowPathRef}
          d={roadPathD}
          stroke="#5A5F69"
          strokeWidth={ROAD_WIDTH + 16}
          strokeLinecap="round"
          fill="none"
          opacity={0.18}
          style={{ filter: 'blur(18px)' }}
        />

        {/* Multi-layered asphalt road group */}
        <g opacity={0.55}>
          {/* Road asphalt surface */}
          <path
            ref={pathRef}
            d={roadPathD}
            stroke="#5A5F69"
            strokeWidth={ROAD_WIDTH}
            strokeLinecap="round"
            fill="none"
          />

          {/* Kerb lines along edges */}
          <path
            ref={edgePathRef}
            d={roadPathD}
            stroke="#787E89"
            strokeWidth={ROAD_WIDTH - 3}
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          />

          {/* White/grey dashed center line */}
          <path
            d={roadPathD}
            stroke="#E8EAEE"
            strokeWidth={2.5}
            strokeDasharray="14 20"
            strokeLinecap="butt"
            fill="none"
            opacity={0.75}
            mask="url(#guaranteesRoadMask)"
          />
        </g>

        {/* Top-down animated red Firehouse pickup truck at the tip */}
        <g
          ref={truckMarkerRef}
          className="overflow-visible pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          {/* Subtle red under-glow halo */}
          <ellipse
            cx="0"
            cy="1"
            rx="46"
            ry="16"
            fill="#e23d28"
            opacity={0.35}
            filter="url(#truckHaloFilterGuarantees)"
          />

          {/* Red Firehouse pickup truck facing forward along road tangent */}
          <g ref={truckFlipRef}>
            <image
              href="/images/firehouse_pickup_truck.png"
              width="92"
              height="32"
              x="-46"
              y="-16"
              preserveAspectRatio="xMidYMid meet"
              className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
            />
          </g>
        </g>
      </svg>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-4 max-w-3xl mb-16">
          <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
            <span>WRITTEN GUARANTEES</span>
            <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
          </div>

          <TextReveal as="h2" className="display-heading display-heading--sub text-white leading-[0.92]" variant="flip">
            Three promises we put in writing, <br />
            <span className="text-red-500">and stand behind.</span>
          </TextReveal>
          <p ref={introRef} className="text-neutral-400 text-base sm:text-lg leading-relaxed pt-2">
            Moving should not come with asterisks. When Firehouse takes a relocation, our commitments are contractual and verified.
          </p>
        </div>

        {/* 3 Prominent Cards */}
        <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GUARANTEES.map((g, i) => (
            <TiltCard
              key={g.title}
              className="h-full rounded-3xl"
              maxTilt={7.5}
              perspective={1100}
              scale={1.025}
              delayMs={200}
              glareColor="rgba(239, 68, 68, 0.22)"
              glareSize={420}
            >
              <article
                className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 shadow-2xl transition-all duration-500 hover:border-red-500/50 hover:shadow-[0_25px_60px_-15px_rgba(239,68,68,0.25)]"
              >
                {/* Red Edge Accent along Top on Hover */}
                <span
                  aria-hidden="true"
                  className="bg-red-600 absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 z-30"
                />

                {/* Photo Banner */}
                <div className="relative aspect-16/10 w-full overflow-hidden" data-tilt-depth="6">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover brightness-[0.78] transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div
                    data-tilt-depth="16"
                    className="absolute top-4 left-4 font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/70 border border-white/15 text-red-400 backdrop-blur-md shadow-md"
                  >
                    {g.badge}
                  </div>
                </div>

                {/* Copy Container */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3" data-tilt-depth="10">
                    <span className="font-mono text-xs font-bold text-red-500 tracking-widest uppercase">
                      PROMISE 0{i + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                      {g.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {g.body}
                    </p>
                  </div>

                  <div
                    data-tilt-depth="6"
                    className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Writing</span>
                    </div>
                    <span>USDOT #1939062</span>
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientGuaranteesSection;
