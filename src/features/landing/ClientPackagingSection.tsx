'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldCheck,
  Package,
  Box,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
} from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PackagingStage {
  id: number;
  stepNumber: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  protectionScore: number;
  statusLabel: string;
  specs: { label: string; value: string }[];
  accentColor: string;
}

export const PACKAGING_STAGES: readonly PackagingStage[] = [
  {
    id: 0,
    stepNumber: '01',
    badge: 'STAGE 01 • SURFACE ASSESSMENT',
    title: 'Fragile Item Assessment',
    subtitle: 'Pre-Wrap Inspection & Micro-Fracture Scanning',
    description:
      'Before a single sheet of material touches your item, crew leads inspect glaze surfaces, balance points, and vulnerable protrusions to engineer a custom packaging sequence.',
    image: '/images/packaging/step1_vase.jpg',
    protectionScore: 12,
    statusLabel: 'EXPOSED SURFACE',
    specs: [
      { label: 'Surface Status', value: 'Unprotected Glaze' },
      { label: 'Shock Absorption', value: '0% Dampening' },
      { label: 'Protocol', value: 'White-Glove Check' },
    ],
    accentColor: '#ef4444',
  },
  {
    id: 1,
    stepNumber: '02',
    badge: 'STAGE 02 • ANTI-FRICTION SHIELD',
    title: 'Zero-Scratch Kraft Paper Wrap',
    subtitle: 'Non-Abrasive Acid-Free Primary Barrier',
    description:
      'The item is wrapped in dense, acid-free newsprint and heavy kraft paper. This creates a breathable friction shield that prevents hairline scuffs, finish wear, and dust intrusion during transit.',
    image: '/images/packaging/step2_paper.jpg',
    protectionScore: 42,
    statusLabel: 'ANTI-SCUFF WRAPPED',
    specs: [
      { label: 'Paper Grade', value: '80lb Virgin Kraft' },
      { label: 'Surface Coverage', value: '360° Form-Fitted' },
      { label: 'Friction Shield', value: '100% Non-Abrasive' },
    ],
    accentColor: '#f97316',
  },
  {
    id: 2,
    stepNumber: '03',
    badge: 'STAGE 03 • IMPACT DAMPENING',
    title: 'Multi-Layer Bubble Cushioning',
    subtitle: 'High-Density Pneumatic Air-Cell Enclosure',
    description:
      'Thick, commercial-grade bubble wrap is wrapped around the paper barrier and sealed under tension with tape. Every individual air cell acts as a pneumatic shock absorber, isolating the ceramic from road hum.',
    image: '/images/packaging/step3_bubblewrap.jpg',
    protectionScore: 78,
    statusLabel: 'SHOCK-ABSORBING CORE',
    specs: [
      { label: 'Cell Height', value: '1/2" Sealed Barrier' },
      { label: 'Vibration Isolation', value: '99.4% Dampened' },
      { label: 'Sealing Method', value: 'Cross-Tension Tape' },
    ],
    accentColor: '#eab308',
  },
  {
    id: 3,
    stepNumber: '04',
    badge: 'STAGE 04 • CORRUGATED CRADLE',
    title: 'Cushioned Box Packing',
    subtitle: 'Centered In 200lb-Burst Corrugated Box',
    description:
      'The cushioned item is lowered into a heavy-duty corrugated dish-pack box and surrounded by dense kraft void-fill bedding so the piece floats suspended with zero contact against outer walls.',
    image: '/images/packaging/step4_box.jpg',
    protectionScore: 92,
    statusLabel: 'VOID-FILL SUSPENDED',
    specs: [
      { label: 'Crate / Box Grade', value: '200lb-Burst Double-Wall' },
      { label: 'Void Buffer', value: '3" Perimeter Bedding' },
      { label: 'Interior Nest', value: 'Compacted Kraft Cushion' },
    ],
    accentColor: '#10b981',
  },
  {
    id: 4,
    stepNumber: '05',
    badge: 'STAGE 05 • ROUTE TRANSIT READY',
    title: 'Flaps Closed & H-Tape Sealed',
    subtitle: 'Box Sealed Tight Under Structural Tension',
    description:
      'All four flaps fold flush and lock down under structural compression. Sealed along all seams using industrial fiberglass-reinforced acrylic tape in the commercial H-pattern for guaranteed route arrival.',
    image: '/images/packaging/step5_box_closed.jpg',
    protectionScore: 100,
    statusLabel: '100% TRANSIT READY',
    specs: [
      { label: 'Seal Pattern', value: 'Commercial H-Taping' },
      { label: 'Top Flap Closure', value: 'Flush Structural Lock' },
      { label: 'Transit Guarantee', value: 'Zero-Shock Arrival' },
    ],
    accentColor: '#0ea5e9',
  },
];

export const ClientPackagingSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Active step index: 0, 1, 2, 3, 4
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const numStages = PACKAGING_STAGES.length;

  // Initialize GSAP ScrollTrigger Pinned Animation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    const pinSection = pinSectionRef.current;
    if (!container || !pinSection) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=2000',
        pin: pinSection,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1
          setProgress(p);

          // Calculate exact stage index based on progress
          const rawStage = p * (numStages - 1);
          const stageIndex = Math.min(numStages - 1, Math.max(0, Math.round(rawStage)));
          setActiveStep(stageIndex);
        },
      });

      scrollTriggerRef.current = st;
    }, container);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [numStages]);

  // Jump to specific step smoothly
  const jumpToStep = useCallback(
    (stepIndex: number) => {
      const st = scrollTriggerRef.current;
      const targetIndex = Math.max(0, Math.min(numStages - 1, stepIndex));
      setActiveStep(targetIndex);

      if (st) {
        const targetScroll = st.start + (targetIndex / (numStages - 1)) * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [numStages]
  );

  const currentStage = useMemo(() => PACKAGING_STAGES[activeStep], [activeStep]);

  // Smooth continuous image crossfade opacity calculation
  const getImageOpacity = (index: number) => {
    const exactIndex = progress * (numStages - 1);
    const dist = Math.abs(exactIndex - index);
    if (dist >= 1) return 0;
    return Math.max(0, 1 - dist);
  };

  const getImageScale = (index: number) => {
    const exactIndex = progress * (numStages - 1);
    const diff = exactIndex - index;
    // Subtle zoom shift as each stage passes
    return 1 + diff * 0.035;
  };

  return (
    <section
      id="packaging-process"
      ref={containerRef}
      className="relative bg-black text-white selection:bg-red-600 selection:text-white border-b border-neutral-800"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-amber-500/8 rounded-full blur-[140px]" />
      </div>

      {/* Pinned Viewport Container */}
      <div
        ref={pinSectionRef}
        className="min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 lg:px-14 py-8 lg:py-12 relative z-10"
      >
        {/* 1. Header Area */}
        <div className="max-w-6xl mx-auto w-full mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="space-y-4 sm:space-y-5 max-w-3xl">
            <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
              <span>DISCIPLINED PACKAGING PROTOCOL</span>
              <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
            </div>

            <TextReveal
              as="h2"
              className="display-heading display-heading--sub text-white leading-[0.92]"
              variant="flip"
            >
              How we package <br />
              <span className="text-red-500">your goods.</span>
            </TextReveal>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed pt-1">
              Scroll down to watch our 5-stage museum-grade protection sequence unfold in real time.
            </p>
          </div>

          {/* Controls: Scroll Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 uppercase px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950/60">
              <ArrowDown className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              <span>SCROLL TO ADVANCE</span>
            </div>
          </div>
        </div>

        {/* 2. Main Showcase Grid: Left Photo Stage + Right Information Telemetry */}
        <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          {/* Left Column: Visual Stage (All 5 crossfading images with HUD overlay) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] aspect-square rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)]">
              {/* Stack of 5 Crossfading Images */}
              {PACKAGING_STAGES.map((stage, idx) => {
                const opacity = getImageOpacity(idx);
                const scale = getImageScale(idx);

                return (
                  <div
                    key={stage.id}
                    className="absolute inset-0 transition-[opacity] duration-200 ease-out will-change-[opacity,transform]"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      zIndex: activeStep === idx ? 10 : 5,
                    }}
                  >
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      priority={idx === 0}
                      sizes="(min-width: 1024px) 500px, 90vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}

              {/* HUD / Telemetry Overlay Over Photographic Stage */}
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6">
                {/* Top Corner Badge & Crosshairs */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-white shadow-lg">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: currentStage.accentColor }}
                    />
                    <span>{currentStage.badge}</span>
                  </div>

                  {/* Corner Crosshair Graphic */}
                  <div className="text-[10px] font-mono text-neutral-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                    STAGE {currentStage.stepNumber} / 05
                  </div>
                </div>

                {/* Center Pulse on Final Closed Box Step */}
                {activeStep === 4 && (
                  <div className="self-center flex flex-col items-center gap-1.5 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
                      <Lock className="w-4 h-4" />
                      <span>BOX SEALED & COMPRESSED</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      H-TAPE PATTERN APPLIED • ZERO TRANSIT SHOCK
                    </span>
                  </div>
                )}

                {/* Bottom Bar: Live Protection Score Meter */}
                <div className="space-y-1.5 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
                    <span className="text-neutral-400">IMPACT PROTECTION INDEX</span>
                    <span
                      className="font-bold text-white"
                      style={{ color: currentStage.accentColor }}
                    >
                      {currentStage.protectionScore}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${currentStage.protectionScore}%`,
                        backgroundColor: currentStage.accentColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Step Telemetry & Narrative Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step Navigation Tabs (01 to 05) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {PACKAGING_STAGES.map((stage, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => jumpToStep(idx)}
                    aria-label={`Jump to stage ${stage.stepNumber}: ${stage.title}`}
                    className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? 'bg-neutral-900 border-red-500 text-white shadow-md shadow-red-950/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isActive ? 'bg-red-500 scale-125' : 'bg-neutral-600 group-hover:bg-neutral-400'
                      }`}
                    />
                    <span>{stage.stepNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Step Narrative Content */}
            <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-red-500 tracking-[0.2em] uppercase">
                    {currentStage.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-white/10 text-[10px] font-mono font-bold text-neutral-300">
                    <CheckCircle2 className="w-3 h-3 text-red-500" />
                    <span>{currentStage.statusLabel}</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight font-['Aeonik',var(--font-aeonik),sans-serif]">
                  {currentStage.title}
                </h3>

                <p className="text-sm sm:text-base text-red-400/90 font-medium">
                  {currentStage.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {currentStage.description}
              </p>

              {/* 3 Technical Specifications Grid */}
              <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentStage.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1"
                  >
                    <dt className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      {spec.label}
                    </dt>
                    <dd className="text-xs font-semibold text-white truncate">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </div>

              {/* Step Navigation Actions */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => jumpToStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS STAGE</span>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToStep(activeStep + 1)}
                  disabled={activeStep === numStages - 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-wide transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg shadow-red-950/50"
                >
                  <span>{activeStep === 3 ? 'CLOSE BOX' : 'NEXT STAGE'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Pinned Progress Bar */}
        <div className="max-w-6xl mx-auto w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-red-500" />
            <span>MUSEUM-GRADE TRANSIT BUFFERING PROTOCOL</span>
          </div>

          <div className="w-full sm:w-80 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-150 rounded-full"
              style={{ width: `${Math.max(10, ((activeStep + 1) / numStages) * 100)}%` }}
            />
          </div>

          <div className="text-neutral-400">
            <span>STEP {activeStep + 1} OF {numStages}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientPackagingSection;
