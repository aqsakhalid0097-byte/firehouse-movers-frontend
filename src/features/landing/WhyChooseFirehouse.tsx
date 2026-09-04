'use client';

import React from 'react';
import { ShieldCheck, Flame, Users2, Clock4, DollarSign, Award } from 'lucide-react';

export const WhyChooseFirehouse: React.FC = () => {
  const pillars = [
    {
      title: 'Firefighter Work Ethic',
      description: 'We bring the same punctuality, teamwork, and physical fitness to every moving project that firefighters deliver on emergency calls.',
      icon: <Flame className="w-6 h-6 text-red-500" />,
    },
    {
      title: '100% Transparent Estimates',
      description: 'Clear written contracts with no surprise stair charges, hidden fuel surcharges, or unexpected travel fees.',
      icon: <DollarSign className="w-6 h-6 text-red-500" />,
    },
    {
      title: 'Full-Time Professional Movers',
      description: 'Our movers are full-time employees who undergo rigorous background checks, drug screenings, and continuous safety training.',
      icon: <Users2 className="w-6 h-6 text-red-400" />,
    },
    {
      title: 'Punctual 99.4% On-Time Record',
      description: 'We respect your closing date and lease schedule with strict dispatch coordination and real-time crew tracking.',
      icon: <Clock4 className="w-6 h-6 text-red-500" />,
    },
    {
      title: 'Licensed & Fully Insured',
      description: 'Operating in strict compliance with the Texas Department of Motor Vehicles (TXDMV) and Federal Motor Carrier Safety Administration (FMCSA).',
      icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
    },
    {
      title: 'Award-Winning Texas Service',
      description: 'Voted Best Mover across Denton and Dallas counties with thousands of verified 5-star Google and Yelp reviews.',
      icon: <Award className="w-6 h-6 text-red-500" />,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#141414] border-t border-neutral-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Why Texas Homeowners & Businesses Trust Us
          </h2>
          <p className="text-gray-400 text-base">
            We don’t just move furniture — we deliver peace of mind with disciplined execution.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#1b1b1b] border border-neutral-800/80 hover:border-red-500/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseFirehouse;
