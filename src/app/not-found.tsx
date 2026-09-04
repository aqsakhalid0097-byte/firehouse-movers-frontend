'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-[#f3f4f6] flex flex-col items-center justify-center p-6 sm:p-10 text-center font-['Montserrat',sans-serif]">
      <div className="w-[clamp(220px,28vw,320px)] h-auto mx-auto mb-4 select-none">
        <svg
          className="w-full h-auto filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          viewBox="0 0 320 200"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Error 404 Cartoon Firehouse Truck"
        >
          <defs>
            <linearGradient id="g-truck-404" x1="0" x2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <rect x="0" y="150" width="320" height="8" fill="#374151" opacity="0.7" rx="4" />
          <rect x="70" y="95" rx="8" ry="8" width="160" height="50" fill="url(#g-truck-404)" stroke="#991b1b" />
          <rect x="50" y="110" rx="8" ry="8" width="60" height="35" fill="#9ca3af" stroke="#6b7280" />
          <rect x="95" y="103" width="55" height="18" fill="#fca5a5" opacity="0.3" rx="2" />
          <rect x="58" y="115" width="28" height="16" rx="3" fill="#93c5fd" stroke="#60a5fa" />
          <circle cx="95" cy="152" r="13" fill="#111827" stroke="#4b5563" strokeWidth="3" />
          <circle cx="205" cy="152" r="13" fill="#111827" stroke="#4b5563" strokeWidth="3" />
          <text x="150" y="128" textAnchor="middle" fontFamily="monospace, ui-monospace, sans-serif" fontSize="20" fontWeight="bold" fill="#fff">
            404
          </text>
        </svg>
      </div>

      <h1 className="animate-heading font-bold text-[clamp(2rem,4vw,3rem)] tracking-[0.5px] bg-gradient-to-b from-white to-[#cbd5e1] bg-clip-text text-transparent m-0 mb-2">
        Page Not Found
      </h1>
      <p className="text-[#cbd5e1] text-base max-w-md mx-auto m-0 mb-6">
        The route or resource you are looking for does not exist in the Firehouse Movers portal.
      </p>

      <Link
        href="/"
        className="inline-block px-5 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-medium rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5 shadow-lg cursor-pointer"
      >
        Return to Portal
      </Link>
    </div>
  );
}
