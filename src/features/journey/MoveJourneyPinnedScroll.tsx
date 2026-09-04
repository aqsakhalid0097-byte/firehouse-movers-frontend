'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CalendarCheck,
  PackageCheck,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Shield,
  ArrowDown,
  ArrowRight,
  Navigation,
  Sliders,
  Link2,
  Box,
} from 'lucide-react';
import { JourneyLiveDispatchFeed } from './JourneyLiveDispatchFeed';
import { JourneyFeatureCard } from './JourneyFeatureCard';
import { TextReveal } from '@/components/TextReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StageFeature {
  title: string;
  desc: string;
  iconType: 'shield' | 'package' | 'link';
}

export interface MilestoneStage {
  id: number;
  key: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  time: string;
  statusTag: string;
  icon: React.ReactNode;
  qualityCheck: string;
  buttonLabel: string;
  features: StageFeature[];
}

export const stagesData: MilestoneStage[] = [
  {
    id: 1,
    key: 'dispatched',
    label: 'STAGE 01',
    title: 'Walkthrough & quote',
    subtitle: 'Station 1 HQ • Lewisville, TX',
    description: "We look at what's actually moving before we price it. Room by room, stairs counted, tight doorways noted, fragile items flagged. The number you get is the number you pay.",
    location: 'ON SITE OR VIDEO',
    time: '24 HR',
    statusTag: 'QUOTE',
    icon: <CalendarCheck className="w-6 h-6 text-red-500" />,
    qualityCheck: 'Pre-trip safety check: Completed',
    buttonLabel: 'View Dispatch Sheet',
    features: [
      {
        title: 'Truck Inspection',
        desc: 'Air-ride suspension & liftgate checked',
        iconType: 'shield',
      },
      {
        title: 'Pads & Runners',
        desc: 'Quilted blankets & neoprene loaded',
        iconType: 'package',
      },
      {
        title: 'Crew Assigned',
        desc: 'Lead mover Marcus & team en route',
        iconType: 'link',
      },
    ],
  },
  {
    id: 2,
    key: 'loaded',
    label: 'STAGE 02',
    title: 'Pack & protect',
    subtitle: 'Origin Residence • Frisco, TX',
    description: "Cartons sized to the contents, not to whatever's on the truck. Pads on the furniture, corners on the doorframes, floor runners down before a single item moves.",
    location: 'MATERIALS INCLUDED',
    time: 'DAY 0',
    statusTag: 'PACKING',
    icon: <Box className="w-6 h-6 text-red-500" />,
    qualityCheck: 'Load quality check: Completed',
    buttonLabel: 'View Load Details',
    features: [
      {
        title: 'Floor Protection',
        desc: 'Hardwood floor neoprene runners in place',
        iconType: 'shield',
      },
      {
        title: 'Furniture Secured',
        desc: 'Furniture disassembled & wrapped',
        iconType: 'package',
      },
      {
        title: 'E-Track Locked',
        desc: 'E-track ratchet straps secured tight',
        iconType: 'link',
      },
    ],
  },
  {
    id: 3,
    key: 'in_transit',
    label: 'STAGE 03',
    title: 'Load & secure',
    subtitle: 'Direct Highway Route • GPS Monitored',
    description: "Weight low and forward, straps every tier, nothing riding loose. A load that's packed right doesn't shift — which is most of what damage actually is.",
    location: 'CREW LEAD OWNS IT',
    time: 'DAY 1',
    statusTag: 'LOADING',
    icon: <Truck className="w-6 h-6 text-red-500" />,
    qualityCheck: 'Highway telematics telemetry: Monitored',
    buttonLabel: 'Track Live Transit',
    features: [
      {
        title: 'GPS Telematics',
        desc: 'Real-time vehicle speed & speed track',
        iconType: 'shield',
      },
      {
        title: 'Dedicated Truck',
        desc: 'Zero cargo transfers or shared bays',
        iconType: 'package',
      },
      {
        title: 'Air-Ride Active',
        desc: 'Pneumatic shock absorption enabled',
        iconType: 'link',
      },
    ],
  },
  {
    id: 4,
    key: 'arrived',
    label: 'STAGE 04',
    title: 'Transit',
    subtitle: 'Destination Property • Plano, TX',
    description: "Fleet maintained on Ford Pro's service schedule with live diagnostics. You get the crew lead's number, not a call centre, and an honest arrival window.",
    location: 'TRACKED',
    time: 'LOCAL OR INTERSTATE',
    statusTag: 'IN TRANSIT',
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    qualityCheck: 'Destination arrival check: Completed',
    buttonLabel: 'View Placement Map',
    features: [
      {
        title: 'Entryway Padded',
        desc: 'Door jambs & banister pads in place',
        iconType: 'shield',
      },
      {
        title: 'Room Distribution',
        desc: 'Labeled boxes placed by bedroom',
        iconType: 'package',
      },
      {
        title: 'Frame Assembly',
        desc: 'Beds assembled & mattress set up',
        iconType: 'link',
      },
    ],
  },
  {
    id: 5,
    key: 'delivered',
    label: 'STAGE 05',
    title: 'Place & unpack',
    subtitle: 'Final Walkthrough • Complete',
    description: 'Furniture goes where you want it, not inside the front door. Cartons opened, pads pulled, debris hauled out. We leave when the room is usable.',
    location: '',
    time: '',
    statusTag: 'UNPACKING',
    icon: <CheckCircle2 className="w-6 h-6 text-red-500" />,
    qualityCheck: 'Final move handover: Completed',
    buttonLabel: 'View Signed Bill of Lading',
    features: [
      {
        title: 'Condition Checked',
        desc: '100% item condition verified',
        iconType: 'shield',
      },
      {
        title: 'Debris Cleared',
        desc: 'Shrink wrap & tape fully recycled',
        iconType: 'package',
      },
      {
        title: 'Digital Signoff',
        desc: 'Digital bill of lading & receipt',
        iconType: 'link',
      },
    ],
  },
];

// Wavelength SVG Path string (harmonic sine wave)
const WAVELENGTH_PATH_D =
  'M 60,110 C 160,20 180,20 280,50 C 380,80 400,165 500,120 C 600,75 620,20 720,50 C 820,80 840,165 940,110';

export const MoveJourneyPinnedScroll: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const wavePathRef = useRef<SVGPathElement | null>(null);
  const activeWavePathRef = useRef<SVGPathElement | null>(null);
  const truckGroupRef = useRef<SVGGElement | null>(null);

  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);
  const [visibleMessageCount, setVisibleMessageCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'details' | 'dispatch'>('details');
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pinContainer = pinSectionRef.current;
    const triggerElem = triggerRef.current;
    const pathElem = wavePathRef.current;
    const activePathElem = activeWavePathRef.current;
    const truckElem = truckGroupRef.current;

    if (!pinContainer || !triggerElem || !pathElem || !activePathElem) return;

    let totalLength = 0;
    try {
      totalLength = pathElem.getTotalLength() || 0;
    } catch {
      totalLength = 0;
    }
    const safeLength = totalLength > 10 ? totalLength : 1040;

    // Configure active stroke dash
    activePathElem.style.strokeDasharray = `${safeLength} ${safeLength}`;
    activePathElem.style.strokeDashoffset = `${safeLength}`;

    // Calculate exact (x, y) coordinates for all 5 checkpoint nodes along the wavelength
    if (totalLength > 10) {
      const fractions = [0.0, 0.25, 0.5, 0.75, 1.0];
      const computedNodes = fractions.map((frac) => {
        const pt = pathElem.getPointAtLength(frac * safeLength);
        return { x: pt.x, y: pt.y };
      });
      setNodePositions(computedNodes);

      // Initialize truck at starting position
      const initialPt = pathElem.getPointAtLength(0);
      if (truckElem) {
        truckElem.setAttribute('transform', `translate(${initialPt.x}, ${initialPt.y}) rotate(-20)`);
      }
    }

    // Pinned ScrollTrigger instance
    const st = ScrollTrigger.create({
      trigger: triggerElem,
      start: 'top top',
      end: '+=2800',
      pin: pinContainer,
      scrub: 0.9,
      onUpdate: (self) => {
        const p = self.progress; // 0 to 1
        setScrollPercentage(Math.round(p * 100));

        // Smooth active path stroke offset fill
        activePathElem.style.strokeDashoffset = `${safeLength * (1 - p)}`;

        // Dynamic stop stage and in-between typing messages
        if (p < 0.12) {
          setActiveStageIndex(0);
          setVisibleMessageCount(1);
          setIsTyping(false);
          setTypingText('');
        } else if (p < 0.25) {
          setActiveStageIndex(0);
          setVisibleMessageCount(1);
          setIsTyping(true);
          setTypingText('Frisco crew typing…');
        } else if (p < 0.37) {
          setActiveStageIndex(1);
          setVisibleMessageCount(2);
          setIsTyping(false);
          setTypingText('');
        } else if (p < 0.50) {
          setActiveStageIndex(1);
          setVisibleMessageCount(2);
          setIsTyping(true);
          setTypingText('Telematics typing…');
        } else if (p < 0.62) {
          setActiveStageIndex(2);
          setVisibleMessageCount(3);
          setIsTyping(false);
          setTypingText('');
        } else if (p < 0.75) {
          setActiveStageIndex(2);
          setVisibleMessageCount(3);
          setIsTyping(true);
          setTypingText('Plano crew typing…');
        } else if (p < 0.88) {
          setActiveStageIndex(3);
          setVisibleMessageCount(4);
          setIsTyping(false);
          setTypingText('');
        } else if (p < 0.96) {
          setActiveStageIndex(3);
          setVisibleMessageCount(4);
          setIsTyping(true);
          setTypingText('Marcus typing…');
        } else {
          setActiveStageIndex(4);
          setVisibleMessageCount(5);
          setIsTyping(false);
          setTypingText('');
        }

        // Smoothly position and bank the truck along the wavelength curve (only when rendered)
        if (truckElem && pathElem && totalLength > 10) {
          const currentDist = p * safeLength;
          const currentPt = pathElem.getPointAtLength(currentDist);

          // Calculate tangent angle for natural vehicle banking over hills and valleys
          const pPrev = pathElem.getPointAtLength(Math.max(0, currentDist - 2));
          const pNext = pathElem.getPointAtLength(Math.min(safeLength, currentDist + 2));
          const dx = pNext.x - pPrev.x;
          const dy = pNext.y - pPrev.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          truckElem.setAttribute('transform', `translate(${currentPt.x}, ${currentPt.y}) rotate(${angle})`);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const stageCardRef = useRef<HTMLDivElement | null>(null);

  // Smooth choreographed transition animation whenever activeStageIndex changes
  useEffect(() => {
    if (!stageCardRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Icon pop & rotation flourish
      tl.fromTo(
        '.stage-icon-box',
        { scale: 0.72, rotate: -8, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.38, ease: 'back.out(2)' }
      );

      // 2. Stage badge & title slide up
      tl.fromTo(
        '.stage-title-group',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.32, ease: 'power2.out' },
        '-=0.28'
      );

      // 3. Location pill & timestamp glide from right
      tl.fromTo(
        '.stage-meta-group',
        { x: 18, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.32, ease: 'power2.out' },
        '-=0.28'
      );

      // 4. Staggered 3 Feature Cards
      tl.fromTo(
        '.stage-feature-card',
        { y: 18, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.07, duration: 0.38, ease: 'power3.out' },
        '-=0.1'
      );

      // 6. Action button & checkmark footer
      tl.fromTo(
        '.stage-footer-group',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.2'
      );

      // 7. Corner ambient red glow flare
      tl.fromTo(
        '.stage-corner-glow',
        { opacity: 0.15, scale: 0.9 },
        { opacity: 0.65, scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' },
        0
      );
    }, stageCardRef);

    return () => ctx.revert();
  }, [activeStageIndex]);

  const activeStage = stagesData[activeStageIndex] || stagesData[0];

  return (
    <div ref={triggerRef} id="journey" className="relative bg-black text-white w-full">
      {/* Pinned Screen Viewport */}
      <div
        ref={pinSectionRef}
        className="h-screen w-full flex flex-col justify-between p-3 sm:p-5 lg:py-5 lg:px-8 overflow-hidden bg-gradient-to-b from-[#121212] via-black to-[#0d0d0d] relative"
      >
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Top Header & Instructions */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-neutral-800 pb-2 sm:pb-3">
          <div>
            <TextReveal as="h2" className="display-heading display-heading--sub text-white">
              Move Wavelength Journey •{' '}
              <span className="bg-gradient-to-r from-red-600 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-text">
                Loaded to Delivered
              </span>
            </TextReveal>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-neutral-900/90 border border-neutral-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl backdrop-blur-md">
            <Clock className="w-4 h-4 text-red-400 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400">Progress: </span>
              <span className="font-mono font-bold text-white">{scrollPercentage}%</span>
            </div>
            <div className="h-4 w-px bg-neutral-700 mx-0.5 sm:mx-1"></div>
            <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-semibold">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span className="whitespace-nowrap">Scroll to Drive</span>
            </div>
          </div>
        </div>

        {/* Central Wavelength & Stages Content Wrapper */}
        <div className="relative z-10 max-w-6xl mx-auto w-full py-1">
          {/* Responsive SVG Wavelength Container (Desktop only) */}
          <div className="hidden lg:block relative w-full h-[140px] lg:h-[165px] mb-1 sm:mb-2">
            <svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Wavelength Gray to Red Glowing Gradient */}
                <linearGradient id="waveGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a1a1aa" />
                  <stop offset="30%" stopColor="#71717a" />
                  <stop offset="65%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>

                {/* Subtle Shadow Filter for Wave */}
                <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Base Highway Wavelength Background Track */}
              <path
                ref={wavePathRef}
                d={WAVELENGTH_PATH_D}
                fill="none"
                stroke="#262626"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="10 8"
              />

              {/* 2. Active Glowing Progress Wavelength Track */}
              <path
                ref={activeWavePathRef}
                d={WAVELENGTH_PATH_D}
                fill="none"
                stroke="url(#waveGlowGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                filter="url(#waveGlow)"
              />

              {/* 3. Checkpoint Nodes along the Wavelength Curve */}
              {nodePositions.map((pt, idx) => {
                const isReached = idx <= activeStageIndex;
                const isCurrent = idx === activeStageIndex;
                const stage = stagesData[idx];

                return (
                  <g key={idx} transform={`translate(${pt.x}, ${pt.y})`} className="cursor-pointer">
                    {/* Pulsing Aura if Current */}
                    {isCurrent && (
                      <circle r="28" fill="rgba(239, 68, 68, 0.25)" className="animate-ping" />
                    )}

                    {/* Outer Node Circle */}
                    <circle
                      r="18"
                      fill={isCurrent ? '#dc2626' : isReached ? '#1f1f23' : '#141416'}
                      stroke={isCurrent ? '#ffffff' : isReached ? '#ef4444' : '#3f3f46'}
                      strokeWidth={isCurrent ? '3' : '2'}
                      className="transition-all duration-300 drop-shadow-lg"
                    />

                    {/* Node Inner Label / Checkmark */}
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                    >
                      {isReached && !isCurrent ? '✓' : idx + 1}
                    </text>

                    {/* Node Stage Label (Placed Above or Below alternating) */}
                    <text
                      textAnchor="middle"
                      dy={idx % 2 === 0 ? '-26' : '36'}
                      fill={isCurrent ? '#f87171' : isReached ? '#ffffff' : '#71717a'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                      className="transition-colors duration-300 drop-shadow-md"
                    >
                      {stage.title.split('•')[0]}
                    </text>
                  </g>
                );
              })}

              {/* 4. Animated Driving Truck Marker Riding Wavelength */}
              <g ref={truckGroupRef} className="pointer-events-none drop-shadow-2xl">
                {/* Firehouse Pickup Truck Graphic */}
                <image
                  href="/images/firehouse_pickup_truck.png"
                  width="56"
                  height="20"
                  x="-28"
                  y="-10"
                  preserveAspectRatio="xMidYMid meet"
                  className="drop-shadow-lg"
                />
              </g>
            </svg>
          </div>

        {/* Mobile View Switcher (Details vs Live Dispatch) - only visible on < lg */}
        <div className="flex lg:hidden items-center justify-center p-1 mb-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl max-w-xs mx-auto w-full">
          <button
            type="button"
            onClick={() => setMobileTab('details')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mobileTab === 'details'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stage Details
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('dispatch')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mobileTab === 'dispatch'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Live Dispatch</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Row: 70% Stage Card + 30% Live Dispatch Messages (Permanently Fixed Full Dimensions) */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 w-full min-h-[380px] lg:h-[435px]">
          {/* Left: 70% Active Highlighted Stage Card (Exact Match to Mockup) */}
          <div
            ref={stageCardRef}
            className={`w-full lg:w-[70%] bg-[#0d0d0f] border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all duration-300 flex-col justify-between self-stretch h-full min-h-[380px] sm:min-h-[435px] ${
              mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Red Ambient Accent on Top-Left Corner */}
            <div className="stage-corner-glow absolute top-0 left-0 w-36 h-36 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 w-44 h-[2px] bg-gradient-to-r from-red-500 via-red-500/80 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 h-44 w-[2px] bg-gradient-to-b from-red-500 via-red-500/80 to-transparent pointer-events-none" />

            {/* Top Row: Stage Icon, Stage 2 Label, Tag, Title, Address Pill, Timestamp */}
            <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4 relative z-10">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="stage-icon-box w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#180f12] border border-red-500/40 flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                  {activeStage.icon}
                </div>
                <div className="stage-title-group">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                      {activeStage.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-500/30">
                      {activeStage.statusTag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {activeStage.title}
                  </h3>
                </div>
              </div>

              <div className="stage-meta-group text-right">
                {activeStage.location && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-200 font-mono bg-[#141416] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-white/[0.08]">
                    <Navigation className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-500" />
                    <span>{activeStage.location}</span>
                  </div>
                )}
                {activeStage.time && (
                  <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 sm:mt-1.5 font-mono">
                    {activeStage.time}
                  </div>
                )}
              </div>
            </div>

            {/* 3 Feature Flip Cards — Cyber HUD card design in Firehouse Red with card dimensions */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-2 sm:my-3 relative z-10 w-full max-w-xl mx-auto items-center">
              {activeStage.features.map((feat, i) => (
                <JourneyFeatureCard
                  key={i}
                  feat={feat}
                  index={i}
                  stageLabel={activeStage.label}
                  isFlipped={!!flippedCards[i]}
                  onToggleFlip={() => setFlippedCards((prev) => ({ ...prev, [i]: !prev[i] }))}
                />
              ))}
            </div>

              {/* Bottom Action / Quality Check Bar */}
              <div className="stage-footer-group flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-2.5 sm:pt-3 border-t border-white/[0.06] relative z-10 mt-1 sm:mt-2">
                <button className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-transparent border border-red-500/50 hover:bg-red-950/30 text-white text-[11px] sm:text-xs font-semibold tracking-wide transition-colors group">
                  <Sliders className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-400" />
                  <span>{activeStage.buttonLabel}</span>
                  <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                  <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500 shrink-0" />
                  <span className="text-gray-400">
                    {activeStage.qualityCheck.split(':')[0]}:
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {activeStage.qualityCheck.split(':')[1] || 'Completed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 30% Live Dispatch Messages */}
            <JourneyLiveDispatchFeed
              visibleCount={visibleMessageCount}
              isTyping={isTyping}
              typingText={typingText}
              activeStageIndex={activeStageIndex}
              className={mobileTab === 'dispatch' ? 'flex' : 'hidden lg:flex'}
            />
          </div>
        </div>

        {/* Bottom Pinned Footer */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs text-gray-500 pt-2 border-t border-neutral-900 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-400 shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Active Dispatch </span>Chain of Custody Verified
            </span>
          </div>
          <div className="font-mono text-gray-400 shrink-0 text-right">
            <span className="hidden sm:inline">Stage {activeStageIndex + 1} of 5 Active</span>
            <span className="inline sm:hidden">Stage {activeStageIndex + 1}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveJourneyPinnedScroll;
