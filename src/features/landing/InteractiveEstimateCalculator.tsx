'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calculator, Users, Truck, Clock, DollarSign, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Send } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const InteractiveEstimateCalculator: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [homeSize, setHomeSize] = useState<'1br' | '2br' | '3br' | '4br' | 'commercial'>('2br');
  const [packingLevel, setPackingLevel] = useState<'none' | 'partial' | 'full'>('partial');
  const [hasHeavyItem, setHasHeavyItem] = useState<boolean>(false);
  const [hasStairs, setHasStairs] = useState<boolean>(true);

  // Lead capture state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.from('.calculator-card-box', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Dynamic pricing calculation
  const estimate = useMemo(() => {
    let baseHours = 3;
    let crewCount = 2;
    let truckCount = 1;
    let baseRatePerHour = 160;

    switch (homeSize) {
      case '1br':
        baseHours = 3.5;
        crewCount = 2;
        truckCount = 1;
        break;
      case '2br':
        baseHours = 5.0;
        crewCount = 3;
        truckCount = 1;
        baseRatePerHour = 210;
        break;
      case '3br':
        baseHours = 6.5;
        crewCount = 3;
        truckCount = 1;
        baseRatePerHour = 220;
        break;
      case '4br':
        baseHours = 8.5;
        crewCount = 4;
        truckCount = 2;
        baseRatePerHour = 295;
        break;
      case 'commercial':
        baseHours = 7.0;
        crewCount = 4;
        truckCount = 2;
        baseRatePerHour = 310;
        break;
    }

    if (packingLevel === 'partial') {
      baseHours += 1.5;
    } else if (packingLevel === 'full') {
      baseHours += 3.0;
    }

    if (hasHeavyItem) {
      baseHours += 1.0;
    }

    if (hasStairs) {
      baseHours += 0.5;
    }

    const minPrice = Math.round(baseHours * baseRatePerHour * 0.95);
    const maxPrice = Math.round(baseHours * baseRatePerHour * 1.15);

    return {
      hours: baseHours.toFixed(1),
      crew: crewCount,
      trucks: truckCount,
      minPrice,
      maxPrice,
    };
  }, [homeSize, packingLevel, hasHeavyItem, hasStairs]);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setIsSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="pricing-calculator" className="py-24 sm:py-32 bg-gradient-to-b from-[#121212] via-black to-[#121212] text-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="calculator-card-box text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Calculate Your Move Estimate in Seconds
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Transparent estimates with no hidden fees, travel surprises, or fuel markups.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="calculator-card-box lg:col-span-7 bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
            {/* 1. Home / Move Size Selector */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">1. Select Property Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: '1br', label: '1 Bed / Apt', sub: 'Up to 900 sq ft' },
                  { id: '2br', label: '2-3 Bed Home', sub: '1,000 - 1,800 sq ft' },
                  { id: '3br', label: '3-4 Bed House', sub: '1,900 - 2,800 sq ft' },
                  { id: '4br', label: '4+ Bed Estate', sub: '3,000+ sq ft' },
                  { id: 'commercial', label: 'Commercial Office', sub: 'Desks & Suites' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHomeSize(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      homeSize === item.id
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/50'
                        : 'bg-[#222222] border-neutral-700/80 text-gray-300 hover:bg-[#282828]'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Packing Services Selection */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">2. Packing Assistance Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'none', label: 'Self Packed', sub: 'You pack all boxes' },
                  { id: 'partial', label: 'Fragile Only', sub: 'Dishes, TV & Art' },
                  { id: 'full', label: 'Full Service', sub: 'Complete packing' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPackingLevel(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      packingLevel === item.id
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/50'
                        : 'bg-[#222222] border-neutral-700/80 text-gray-300 hover:bg-[#282828]'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Add-on Checkboxes */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">3. Move Specifications</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-[#222222] border border-neutral-700/80 rounded-xl cursor-pointer hover:bg-[#262626] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasStairs}
                    onChange={(e) => setHasStairs(e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-neutral-900 border-neutral-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-200">Staircases or Elevator access required</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#222222] border border-neutral-700/80 rounded-xl cursor-pointer hover:bg-[#262626] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasHeavyItem}
                    onChange={(e) => setHasHeavyItem(e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-neutral-900 border-neutral-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-200">Heavy Item (Piano, Gun Safe, Pool Table)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results & Lead Capture Column (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#202020] to-[#161616] border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Result Header */}
            <div className="border-b border-neutral-700 pb-5">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                Estimated Relocation Range
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ${estimate.minPrice.toLocaleString()} - ${estimate.maxPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Based on estimated crew duration & truck allocation</p>
            </div>

            {/* Breakdown Badges */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <Users className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <div className="font-bold text-white text-sm">{estimate.crew} Movers</div>
                <div className="text-[10px] text-gray-400">Certified Crew</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <Truck className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <div className="font-bold text-white text-sm">{estimate.trucks} Truck{estimate.trucks > 1 ? 's' : ''}</div>
                <div className="text-[10px] text-gray-400">26ft Commercial</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <Clock className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <div className="font-bold text-white text-sm">{estimate.hours} hrs</div>
                <div className="text-[10px] text-gray-400">Estimated Time</div>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-2 text-xs text-gray-300 border-t border-neutral-800 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Moving blankets, pads & shrink wrap included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Disassembly & reassembly of basic furniture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Door jamb protectors & neoprene floor runners</span>
              </div>
            </div>

            {/* Lead Capture Box */}
            {isSubmitted ? (
              <div className="p-5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Estimate Request Received!</h4>
                <p className="text-xs text-gray-300">
                  Our dispatch coordinator is reviewing your details and will contact you at <strong>{customerPhone}</strong> with your official written proposal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3 pt-2">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#141414] border border-neutral-700 text-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Phone (e.g. 972-539-9588)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#141414] border border-neutral-700 text-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-neutral-700 text-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-bold rounded-lg shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Lock In This Estimate Rate</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveEstimateCalculator;
