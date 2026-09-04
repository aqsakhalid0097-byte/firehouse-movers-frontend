'use client';

import React, { useId } from 'react';
import { Shield, Box, Link2 } from 'lucide-react';
import { StageFeature } from './MoveJourneyPinnedScroll';

interface JourneyFeatureCardProps {
  feat: StageFeature;
  index: number;
  stageLabel?: string;
  isFlipped: boolean;
  onToggleFlip: () => void;
}

export const JourneyFeatureCard: React.FC<JourneyFeatureCardProps> = ({
  feat,
  index,
  stageLabel = 'STAGE 01',
  isFlipped,
  onToggleFlip,
}) => {
  const uid = useId().replace(/:/g, '_');

  return (
    <div
      onClick={onToggleFlip}
      className="stage-feature-card group [perspective:1200px] w-full max-w-[120px] xs:max-w-[145px] sm:max-w-[165px] lg:max-w-[175px] mx-auto aspect-[216/312] cursor-pointer select-none"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ================= Front Face (Sci-Fi Cyber HUD Card in Firehouse Red) ================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[4px] overflow-hidden drop-shadow-xl">
          <svg
            className="w-full h-full block"
            viewBox="0 0 216 312"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={`cardClip_${uid}`}>
                <rect x="12" y="12" width="192" height="288" rx="2" />
              </clipPath>
              <filter id={`redGlow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id={`cardBg_${uid}`} x1="0" y1="0" x2="216" y2="312" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#140609" />
                <stop offset="50%" stopColor="#090204" />
                <stop offset="100%" stopColor="#110508" />
              </linearGradient>
            </defs>

            {/* Dark Red Carbon Base */}
            <rect x="12" y="12" width="192" height="288" rx="2" fill={`url(#cardBg_${uid})`} />

            {/* Clipped Diamond Wireframe & Shaded Triangles */}
            <g clipPath={`url(#cardClip_${uid})`}>
              {/* Shaded Isometric Triangles (Exact positions from reference) */}
              <path d="M 12 36 L 60 84 L 12 84 Z" fill="#ef4444" fillOpacity="0.10" />
              <path d="M 204 36 L 156 84 L 204 84 Z" fill="#ef4444" fillOpacity="0.10" />
              <path d="M 12 252 L 60 204 L 12 204 Z" fill="#ef4444" fillOpacity="0.10" />
              <path d="M 204 252 L 156 204 L 204 204 Z" fill="#ef4444" fillOpacity="0.10" />

              {/* Large Corner Triangles */}
              <path d="M 12 12 L 84 12 L 12 84 Z" fill="#ef4444" fillOpacity="0.04" />
              <path d="M 204 12 L 132 12 L 204 84 Z" fill="#ef4444" fillOpacity="0.04" />

              {/* Diagonal Grid: +45° */}
              <g stroke="#ef4444" strokeOpacity="0.14" strokeWidth="0.8">
                <line x1="-60" y1="12" x2="220" y2="292" />
                <line x1="-60" y1="60" x2="220" y2="340" />
                <line x1="-60" y1="108" x2="220" y2="388" />
                <line x1="-60" y1="156" x2="220" y2="436" />
                <line x1="-60" y1="-36" x2="220" y2="244" />
                <line x1="-60" y1="-84" x2="220" y2="196" />
                <line x1="-60" y1="-132" x2="220" y2="148" />

                {/* Diagonal Grid: -45° */}
                <line x1="276" y1="12" x2="-4" y2="292" />
                <line x1="276" y1="60" x2="-4" y2="340" />
                <line x1="276" y1="108" x2="-4" y2="388" />
                <line x1="276" y1="156" x2="-4" y2="436" />
                <line x1="276" y1="-36" x2="-4" y2="244" />
                <line x1="276" y1="-84" x2="-4" y2="196" />
                <line x1="276" y1="-132" x2="-4" y2="148" />

                {/* Vertical Grid Lines */}
                <line x1="36" y1="12" x2="36" y2="300" />
                <line x1="60" y1="12" x2="60" y2="300" />
                <line x1="84" y1="12" x2="84" y2="300" />
                <line x1="108" y1="12" x2="108" y2="300" />
                <line x1="132" y1="12" x2="132" y2="300" />
                <line x1="156" y1="12" x2="156" y2="300" />
                <line x1="180" y1="12" x2="180" y2="300" />
              </g>
            </g>

            {/* Outer Border Rectangle */}
            <rect
              x="12"
              y="12"
              width="192"
              height="288"
              stroke="#ef4444"
              strokeOpacity="0.8"
              strokeWidth="1.5"
              fill="none"
              rx="2"
            />

            {/* Corner Brackets (HUD Precision Crop Marks) */}
            {/* Top-Left */}
            <path d="M 10 24 L 10 10 L 24 10" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <rect x="9" y="9" width="3.5" height="3.5" fill="#ef4444" />
            <line x1="12" y1="18" x2="18" y2="12" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            {/* Top-Right */}
            <path d="M 192 10 L 206 10 L 206 24" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <rect x="203.5" y="9" width="3.5" height="3.5" fill="#ef4444" />
            <line x1="204" y1="18" x2="198" y2="12" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            {/* Bottom-Left */}
            <path d="M 10 288 L 10 302 L 24 302" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <rect x="9" y="299.5" width="3.5" height="3.5" fill="#ef4444" />
            <line x1="12" y1="294" x2="18" y2="300" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            {/* Bottom-Right */}
            <path d="M 192 302 L 206 302 L 206 288" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <rect x="203.5" y="299.5" width="3.5" height="3.5" fill="#ef4444" />
            <line x1="204" y1="294" x2="198" y2="300" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            {/* Side Inset Notches */}
            <path d="M 12 98 L 19 105" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M 204 98 L 197 105" stroke="#ef4444" strokeWidth="1.5" />

            {/* Folded Chevron Wings dipping towards center */}
            <path
              d="M 12 105 C 20 110, 24 114, 32 114 L 64 114 L 96 146"
              stroke="#ef4444"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 204 105 C 196 110, 192 114, 184 114 L 152 114 L 120 146"
              stroke="#ef4444"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Radiating diagonal lines behind diamond */}
            <line x1="108" y1="135" x2="72" y2="99" stroke="#ef4444" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="108" y1="135" x2="144" y2="99" stroke="#ef4444" strokeOpacity="0.5" strokeWidth="1" />

            {/* Central Outer Diamond (Glow Filter) */}
            <polygon
              points="108,135 143,170 108,205 73,170"
              stroke="#ef4444"
              strokeWidth="3"
              fill="#18070b"
              filter={`url(#redGlow_${uid})`}
            />

            {/* Central Inner Diamond */}
            <polygon
              points="108,143 135,170 108,197 81,170"
              stroke="#ef4444"
              strokeOpacity="0.8"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Concentric Center Circle */}
            <circle cx="108" cy="170" r="14" stroke="#ef4444" strokeWidth="1.5" fill="#200a0f" />

            {/* Center Feature Icon */}
            {feat.iconType === 'shield' && (
              <g
                transform="translate(108, 170) scale(0.75) translate(-12, -12)"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </g>
            )}

            {feat.iconType === 'package' && (
              <g
                transform="translate(108, 170) scale(0.72) translate(-12, -12)"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </g>
            )}

            {feat.iconType === 'link' && (
              <g
                transform="translate(108, 170) scale(0.75) translate(-12, -12)"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </g>
            )}

            {/* Lower Plumb Axis */}
            <line x1="108" y1="205" x2="108" y2="268" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="108" y1="268" x2="108" y2="282" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />

            {/* Diagonal Telemetry Ticks flanking lower axis */}
            <line x1="96" y1="214" x2="100" y2="218" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="94" y1="220" x2="98" y2="224" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="92" y1="226" x2="96" y2="230" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="94" y1="232" x2="98" y2="236" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            {/* Telemetry Dots column */}
            <circle cx="92" cy="216" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="90" cy="222" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="88" cy="228" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="90" cy="234" r="0.75" fill="#ef4444" opacity="0.6" />

            <line x1="120" y1="214" x2="116" y2="218" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="122" y1="220" x2="118" y2="224" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="124" y1="226" x2="120" y2="230" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
            <line x1="122" y1="232" x2="118" y2="236" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

            <circle cx="124" cy="216" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="126" cy="222" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="128" cy="228" r="0.75" fill="#ef4444" opacity="0.6" />
            <circle cx="126" cy="234" r="0.75" fill="#ef4444" opacity="0.6" />
          </svg>
        </div>

        {/* ================= Back Face (#828181 Grey Interior with Red Framing & Black Typography) ================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[4px] border border-red-500 bg-[#828181] p-2.5 xs:p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-2xl shadow-black/40">
          {/* 4 HUD Corner Brackets in Firehouse Red */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-[2.5px] border-l-[2.5px] border-red-500 pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-[2.5px] border-r-[2.5px] border-red-500 pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-[2.5px] border-l-[2.5px] border-red-500 pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-[2.5px] border-r-[2.5px] border-red-500 pointer-events-none" />

          {/* Background Wireframe Matrix */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            viewBox="0 0 200 290"
            fill="none"
          >
            <g stroke="#ef4444" strokeWidth="1">
              <line x1="-50" y1="12" x2="220" y2="282" />
              <line x1="-50" y1="60" x2="220" y2="330" />
              <line x1="-50" y1="108" x2="220" y2="378" />
              <line x1="250" y1="12" x2="-20" y2="282" />
              <line x1="250" y1="60" x2="-20" y2="330" />
              <line x1="250" y1="108" x2="-20" y2="378" />
            </g>
          </svg>

          {/* Top Stage & Index Pill */}
          <div className="flex items-center justify-between relative z-10">
            <span className="font-mono text-[8px] sm:text-[9px] font-extrabold text-red-700 uppercase tracking-widest bg-black/15 px-1.5 sm:px-2 py-0.5 rounded border border-red-500/60">
              SPEC 0{index + 1}
            </span>
            <span className="font-mono text-[7.5px] sm:text-[8.5px] font-bold text-black tracking-wider">
              {stageLabel}
            </span>
          </div>

          {/* Center Info Area */}
          <div className="text-center relative z-10 my-auto px-0.5">
            {/* Rotating Mini Diamond Badge with Red Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-1.5 sm:mb-2 rotate-45 border-2 border-red-500 bg-black/20 flex items-center justify-center shadow-md shadow-red-500/15">
              <div className="-rotate-45 text-red-600">
                {feat.iconType === 'shield' && <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />}
                {feat.iconType === 'package' && <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />}
                {feat.iconType === 'link' && <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />}
              </div>
            </div>

            <div className="text-[11px] xs:text-xs sm:text-[13.5px] font-black text-black leading-tight tracking-tight">
              {feat.title}
            </div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10.5px] font-bold text-black leading-snug mt-1 sm:mt-1.5 line-clamp-3">
              {feat.desc}
            </div>
          </div>

          {/* Bottom Protocol Status Bar */}
          <div className="flex items-center justify-center gap-1.5 relative z-10 border-t border-black/20 pt-1 sm:pt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
            <span className="text-[7.5px] sm:text-[9px] font-mono font-bold text-black tracking-wider uppercase truncate">
              ACTIVE PROTOCOL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
