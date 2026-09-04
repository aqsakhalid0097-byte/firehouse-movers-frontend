'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Sarah M.',
      location: 'Frisco, TX',
      moveType: '4-Bedroom Home Relocation',
      rating: 5,
      date: 'August 2026',
      content:
        'Firehouse Movers were phenomenal! The 4-man crew arrived exactly on time in two clean trucks. They wrapped all our antique furniture and even padded our hardwood stairs. Nothing was scratched or damaged. Worth every single penny!',
    },
    {
      author: 'David & Lisa K.',
      location: 'Lewisville, TX',
      moveType: 'Townhome to Single Family',
      rating: 5,
      date: 'July 2026',
      content:
        'As a veteran family, we loved supporting a firefighter-owned business. The team was respectful, incredibly fast, and very organized. The estimate we received online was almost exact to the final invoice with no surprises.',
    },
    {
      author: 'Marcus R.',
      location: 'Plano, TX',
      moveType: 'Corporate Office Move (30 Workstations)',
      rating: 5,
      date: 'August 2026',
      content:
        'We relocated our tech startup on a Saturday. Firehouse Movers handled all our server racks, conference tables, and monitor setups seamlessly. We opened for business Monday morning without missing a beat.',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Trusted by Thousands of Texas Families
          </h2>
          <p className="text-gray-400 text-base">
            Read authentic reviews from homeowners and business managers who experienced the Firehouse difference.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#171717] border border-neutral-800 rounded-2xl p-7 flex flex-col justify-between relative hover:border-neutral-700 transition-colors shadow-lg"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-700" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
                  "{rev.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-neutral-800/80 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                    <p className="text-xs text-gray-400">{rev.location}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Move</span>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 font-mono">{rev.moveType}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
