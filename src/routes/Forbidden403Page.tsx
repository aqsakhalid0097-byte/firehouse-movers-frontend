'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Forbidden403PageProps {
  title?: string;
  message?: string;
  homePath?: string;
}

export const Forbidden403Page: React.FC<Forbidden403PageProps> = ({
  title = 'No entry to this loading zone!',
  message = 'You’re trying to access a restricted area.',
  homePath = '/',
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-[#f3f4f6] flex flex-col items-center justify-center p-6 sm:p-10 text-center font-['Montserrat',sans-serif] selection:bg-red-500 selection:text-white">
      {/* Cartoon Firehouse Truck Error Graphic with animated rotating wheels & siren */}
      <div className="w-[clamp(220px,28vw,320px)] h-auto mx-auto mb-4 select-none">
        <svg
          className="w-full h-auto filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          viewBox="0 0 320 200"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Error 403 Cartoon Firehouse Truck"
        >
          <defs>
            <linearGradient id="g-truck-403" x1="0" x2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <style>{`
              @keyframes truck-wheel-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes truck-siren-flash {
                from { opacity: 0.35; filter: drop-shadow(0 0 4px rgba(251,191,36,0.3)); }
                to { opacity: 1; filter: drop-shadow(0 0 12px rgba(251,191,36,0.9)); }
              }
              .wheel-front-spin {
                transform-origin: 95px 152px;
                animation: truck-wheel-spin 1.8s linear infinite;
              }
              .wheel-rear-spin {
                transform-origin: 205px 152px;
                animation: truck-wheel-spin 1.8s linear infinite;
              }
              .truck-siren-flash {
                transform-origin: 150px 93px;
                animation: truck-siren-flash 0.8s ease-in-out infinite alternate;
              }
            `}</style>
          </defs>

          {/* Road */}
          <rect x="0" y="150" width="320" height="8" fill="#374151" opacity="0.7" rx="4" />

          {/* Red Cargo Body */}
          <rect x="70" y="95" rx="8" ry="8" width="160" height="50" fill="url(#g-truck-403)" stroke="#991b1b" />

          {/* Front Cab */}
          <rect x="50" y="110" rx="8" ry="8" width="60" height="35" fill="#9ca3af" stroke="#6b7280" />

          {/* Cab Highlight */}
          <rect x="95" y="103" width="55" height="18" fill="#fca5a5" opacity="0.3" rx="2" />

          {/* Cab Window */}
          <rect x="58" y="115" width="28" height="16" rx="3" fill="#93c5fd" stroke="#60a5fa" />

          {/* Flashing Siren */}
          <rect className="truck-siren-flash" x="140" y="88" width="20" height="10" rx="2" fill="#fbbf24" stroke="#b45309" />

          {/* Front Wheel (Left) - spins around center 95px 152px */}
          <g className="wheel-front-spin">
            <circle cx="95" cy="152" r="13" fill="#111827" stroke="#4b5563" strokeWidth="3" />
            <circle cx="95" cy="152" r="9" fill="#1f2937" stroke="#9ca3af" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="95" cy="152" r="4" fill="#d1d5db" />
            <line x1="95" y1="145" x2="95" y2="159" stroke="#374151" strokeWidth="1.5" />
            <line x1="88" y1="152" x2="102" y2="152" stroke="#374151" strokeWidth="1.5" />
          </g>

          {/* Rear Wheel (Right) - spins around center 205px 152px */}
          <g className="wheel-rear-spin">
            <circle cx="205" cy="152" r="13" fill="#111827" stroke="#4b5563" strokeWidth="3" />
            <circle cx="205" cy="152" r="9" fill="#1f2937" stroke="#9ca3af" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="205" cy="152" r="4" fill="#d1d5db" />
            <line x1="205" y1="145" x2="205" y2="159" stroke="#374151" strokeWidth="1.5" />
            <line x1="198" y1="152" x2="212" y2="152" stroke="#374151" strokeWidth="1.5" />
          </g>

          {/* 403 Code */}
          <text x="150" y="128" textAnchor="middle" fontFamily="monospace, ui-monospace, sans-serif" fontSize="20" fontWeight="bold" fill="#fff">
            403
          </text>
        </svg>
      </div>

      {/* Heading */}
      <h1 className="animate-heading font-['Montserrat',sans-serif] font-bold text-[clamp(2rem,4vw,3rem)] tracking-[0.5px] bg-gradient-to-b from-white to-[#cbd5e1] bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(255,255,255,0.06)] m-0 mb-2">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="font-['Montserrat',sans-serif] text-[#cbd5e1] text-base max-w-md mx-auto m-0 mb-6">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href={homePath}
          className="font-['Montserrat',sans-serif] inline-block px-[18px] py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-medium rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_16px_rgba(239,68,68,0.25)] hover:shadow-[0_10px_24px_rgba(220,38,38,0.35)] cursor-pointer"
        >
          Go to Home
        </Link>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="font-['Montserrat',sans-serif] inline-block px-[18px] py-3 bg-transparent hover:bg-neutral-800/80 text-[#f3f4f6] text-sm font-medium rounded-xl border border-[#374151] hover:border-gray-500 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden403Page;
