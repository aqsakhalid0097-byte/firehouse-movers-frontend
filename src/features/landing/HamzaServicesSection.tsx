'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HamzaServiceCard } from './HamzaServiceCard';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES_DATA = [
  {
    title: 'Local Moving',
    image: '/images/local.jpg',
    alt: 'A Firehouse Movers crew loading a truck on a residential street',
    body: 'Same-day and next-day moves across Lewisville and the greater DFW area, with crews who know the neighborhoods.',
  },
  {
    title: 'Long-Distance Relocation',
    image: '/images/long_distance.jpg',
    alt: 'A Firehouse Movers truck on the highway between states',
    body: 'Federally licensed for interstate relocation. One crew, one truck, one point of contact from door to door.',
  },
  {
    title: 'Residential Moving',
    image: '/images/resident.jpg',
    alt: 'Movers carrying wrapped furniture out of a family home',
    body: 'Apartments to luxury estates. We wrap, pad, load, and place every piece exactly where you want it.',
  },
  {
    title: 'Commercial & Office',
    image: '/images/commercial.jpg',
    alt: 'An office being packed down into labelled crates after hours',
    body: 'Office and retail relocations planned around your downtime, executed after hours and over weekends.',
  },
  {
    title: 'Packing & Crating',
    image: '/images/packing.jpg',
    alt: 'Fragile items being wrapped and boxed by a packing crew',
    body: 'Full or partial packing with materials rated for fragile, high-value, and oversized items.',
  },
  {
    title: 'Secure Vault Storage',
    image: '/images/storage.jpg',
    alt: 'Inventoried household goods inside a climate-controlled storage bay',
    body: 'Climate-controlled short and long-term storage with full inventory tracking on every individual item.',
  },
];

/** Stroke width of the asphalt road surface itself, in CSS pixels. */
const ROAD_WIDTH = 22;

/** Minimum spacing between consecutive waypoints in CSS pixels to prevent harsh hairpins. */
const MIN_KNOT_GAP = 32;

/**
 * One round of Chaikin corner-cutting: every interior vertex is replaced
 * by the two points a quarter and three quarters along its edges.
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
 * Waypoints scaled to real pixels, de-duplicated by minimum distance, and
 * rounded twice through Chaikin corner-cutting for natural curvature.
 */
function controlNet(
  w: number,
  h: number,
  waypoints: readonly (readonly [number, number])[]
): [number, number][] {
  const scaled = waypoints.map(([fx, fy]) => [fx * w, fy * h] as [number, number]);
  const pruned: [number, number][] = [scaled[0]];
  for (let i = 1; i < scaled.length; i++) {
    const last = pruned[pruned.length - 1];
    const far = Math.hypot(scaled[i][0] - last[0], scaled[i][1] - last[1]) >= MIN_KNOT_GAP;
    if (far || i === scaled.length - 1) {
      pruned.push(scaled[i]);
    }
  }
  return chaikin(chaikin(pruned));
}

/**
 * Builds a centripetal Catmull-Rom spline (alpha = 0.5) through the smoothed waypoints.
 * Centripetal parameterisation guarantees zero loops or cusps on tight segments.
 */
function buildPath(
  w: number,
  h: number,
  waypoints: readonly (readonly [number, number])[]
): string {
  if (w <= 0 || h <= 0 || waypoints.length < 2) return '';
  const pts = controlNet(w, h, waypoints);
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

/**
 * Builds waypoints that weave through the staggered 2-column service cards,
 * approaching from alternating sides so the route reads as a deliberate
 * fluid S-curve zig-zag between jobs, matching Hamza's project ribbon design.
 */
function buildCheckpointWaypoints(
  w: number,
  h: number,
  checkpoints: readonly [number, number][]
): [number, number][] {
  // Graceful fallback before live measurements
  if (checkpoints.length < 2) {
    return [
      [-0.15, 0.08],
      [0.24, 0.24],
      [0.72, 0.46],
      [0.26, 0.68],
      [0.76, 0.86],
      [1.18, 0.98],
    ];
  }

  // Lead in from off-screen left, arriving below the header copy
  const firstY = Math.min(...checkpoints.map((c) => c[1]));
  const entryY = Math.max(0.04, Math.min(0.14, firstY * 0.72));
  const pts: [number, number][] = [[-0.18, entryY]];

  const SWING = 0.22;
  const aspect = h > 0 ? w / h : 1;

  // Group cards into rows based on vertical layout proximity (~360px window)
  const rowTolerance = 360 / (h || 1);
  const rows: [number, number][][] = [];
  checkpoints.forEach((cp) => {
    const row = rows[rows.length - 1];
    if (row && Math.abs(cp[1] - row[0][1]) < rowTolerance) {
      row.push([...cp] as [number, number]);
    } else {
      rows.push([[...cp] as [number, number]]);
    }
  });

  // Visit alternating sides across the rows (left card of row 0, right card of row 1, etc.)
  const visited = rows.map((row, i) => {
    const wantLeft = i % 2 === 0;
    const sorted = [...row].sort((a, b) => a[0] - b[0]);
    return wantLeft ? sorted[0] : sorted[sorted.length - 1];
  });

  visited.forEach(([cx, cy], i) => {
    const prev = pts[pts.length - 1];
    const prevY = prev[1];
    const gap = Math.max(0.04, cy - prevY);
    const room = gap;
    const swing = Math.min(SWING, (room * 0.55) / (aspect || 1));

    const nextPt = visited[i + 1];
    const toX = nextPt ? nextPt[0] : 1.15;
    const toY = nextPt ? nextPt[1] : cy + 0.16;

    let dirX = (toX - prev[0]) * w;
    let dirY = (toY - prev[1]) * h;
    const mag = Math.hypot(dirX, dirY) || 1;
    dirX /= mag;
    dirY /= mag;

    const reach = Math.min(swing * w, room * 0.45 * h);
    const ax = cx - (dirX * reach) / w;
    const ay = cy - (dirY * reach) / h;
    const ex = cx + (dirX * reach * 0.75) / w;
    const ey = cy + (dirY * reach * 0.75) / h;

    // Three knots per card: approach swing, dead-straight crossing through center, exit swing
    pts.push([ax, ay]);
    pts.push([cx, cy]);
    pts.push([ex, ey]);
  });

  // Natural run-out past the right edge
  const lastPt = pts[pts.length - 1];
  pts.push([1.18, Math.min(0.995, lastPt[1] + 0.05)]);

  return pts;
}

export const HamzaServicesSection: React.FC = () => {
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // SVG road layer refs
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);
  const edgePathRef = useRef<SVGPathElement | null>(null);
  const maskPathRef = useRef<SVGPathElement | null>(null);
  const truckMarkerRef = useRef<SVGGElement | null>(null);

  const [dims, setDims] = useState({ width: 1440, height: 2200 });
  const [checkpoints, setCheckpoints] = useState<[number, number][]>([]);

  // Dynamically measure the section dimensions and card checkpoint centers
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

      const nodes = el.querySelectorAll<HTMLElement>('[data-ribbon-checkpoint]');
      const found: [number, number][] = [];
      nodes.forEach((node) => {
        const r = node.getBoundingClientRect();
        const cx = (r.left + r.width / 2 - rect.left) / rect.width;
        const cy = (r.top + r.height / 2 - rect.top) / rect.height;
        found.push([cx, cy]);
      });
      found.sort((a, b) => a[1] - b[1]);
      if (found.length >= 2) {
        setCheckpoints(found);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Re-measure after image layout stabilization
    const t1 = setTimeout(measure, 200);
    const t2 = setTimeout(measure, 700);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Compute smooth Catmull-Rom road path through the card checkpoints
  const roadPathD = useMemo(() => {
    const waypoints = buildCheckpointWaypoints(dims.width, dims.height, checkpoints);
    return buildPath(dims.width, dims.height, waypoints);
  }, [dims.width, dims.height, checkpoints]);

  // Intro text reveal entrance
  useEffect(() => {
    if (typeof window === 'undefined' || !introRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
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
    });

    return () => ctx.revert();
  }, []);

  // Hamza Motion Physics: viewport-centered scroll tracking, 0.2 smoothed inertia
  // chase to eliminate wheel jitter, and instant 2-point tangent heading
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

      // Anchored to viewport center line for smooth proportional pacing
      const half = window.innerHeight * 0.5;
      const from = pageTop - half;
      const to = Math.min(pageTop + r.height - half, maxScroll);
      const span = Math.max(1, to - from);
      const want = length * Math.min(1, Math.max(0, (window.scrollY - from) / span));

      if (at < 0) {
        at = want;
      } else {
        // Hamza's 0.2 chase: takes all jitter out of the wheel, giving realistic momentum
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

        // 2-point central difference tangent calculation for precise heading
        const back = path.getPointAtLength(Math.max(0, d - 2));
        const fwd = path.getPointAtLength(Math.min(length, d + 2));
        const angle = (Math.atan2(fwd.y - back.y, fwd.x - back.x) * 180) / Math.PI;

        truck.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${angle.toFixed(2)})`
        );

        // Visibility: visible once road starts drawing and within viewport bounds
        const screenY = r.top + pt.y;
        const onScreen =
          pt.x > -60 &&
          pt.x < dims.width + 60 &&
          screenY > -60 &&
          screenY < window.innerHeight + 60;
        truck.style.opacity =
          progress > 0.005 && progress < 0.999 && onScreen ? '1' : '0';
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dims.width, dims.height, roadPathD]);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-ribbon-zone="zigzag"
      className="relative bg-black text-white px-6 sm:px-10 lg:px-16 py-28 border-t border-neutral-800 overflow-hidden"
    >
      {/* Dynamic Hamza SVG Asphalt Road Ribbon & Leading Firehouse Truck */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* Revealed road mask: clips center dashed line to drawn length */}
          <mask id="hamzaServicesRoadMask">
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
          <filter id="truckHaloFilter" x="-50%" y="-50%" width="200%" height="200%">
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

        {/* Multi-layered asphalt road group at 0.55 opacity */}
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
            mask="url(#hamzaServicesRoadMask)"
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
            filter="url(#truckHaloFilter)"
          />

          {/* Red Firehouse pickup truck facing forward along road tangent (+X) */}
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
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
            <span>OUR CAPABILITIES</span>
            <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
          </div>

          <TextReveal as="h2" className="display-heading display-heading--sub text-white leading-[0.92]" variant="flip">
            Everything a move needs, <br />
            <span className="text-red-500">under one roof.</span>
          </TextReveal>
          <p ref={introRef} className="text-neutral-400 text-base sm:text-lg leading-relaxed pt-2">
            Two wide columns in dynamic vertical stagger. Pick what you need — the crew and the discipline stay the same.
          </p>
        </div>

        {/* Two-column offset grid */}
        <div className="mt-20 grid gap-x-12 gap-y-20 md:grid-cols-2 items-start">
          {SERVICES_DATA.map((service, i) => (
            <div key={service.title} className={i % 2 === 1 ? 'md:mt-24' : ''}>
              <HamzaServiceCard
                index={i}
                title={service.title}
                body={service.body}
                image={service.image}
                alt={service.alt}
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HamzaServicesSection;
