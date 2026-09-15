'use client';

import React from 'react';
import Image from 'next/image';
import { Truck, Wrench, ShieldCheck, ExternalLink } from 'lucide-react';
import { TextReveal } from '@/components/TextReveal';

const NETWORK_PARTNERS = [
  {
    id: 'ford-pro',
    title: 'Fleet maintained with Ford Pro',
    category: 'FLEET PARTNER',
    description:
      'Every truck in the fleet runs on Ford Pro’s maintenance and telematics program — scheduled service, real-time telemetry diagnostics, and zero surprises on moving day.',
    icon: <Truck className="w-5 h-5 text-red-500" />,
    image: '/images/two_trucks.jpg',
    highlights: ['Live Telematics Telemetry', 'Factory Ford Pro Inspections', '26ft Heavy-Duty Diesel Rigs'],
  },
  {
    id: '4-alarm',
    title: '4 Alarm Restoration & Facilities',
    category: 'SISTER COMPANY',
    description:
      'Our sister company handles what comes after the boxes: TV mounting, HVAC duct sanitization, and restoration work, held to the exact same standard you hired us for.',
    icon: <Wrench className="w-5 h-5 text-red-500" />,
    image: '/images/uniform.jpg',
    highlights: ['Single Point of Contact', 'Full TV & Art Mounting', 'Air Duct & Water Restoration'],
  },
];

export const AboutFleetPartnersSection: React.FC = () => {
  return (
    <section className="relative bg-[#08080a] text-white py-28 px-6 sm:px-10 lg:px-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-16">
          <div className="flex items-center gap-3 text-red-400 font-mono text-xs font-bold tracking-[0.18em] uppercase">
            <span>THE NETWORK</span>
            <span className="h-px flex-1 max-w-[120px] bg-current opacity-30" />
          </div>

          <TextReveal as="h2" className="display-heading display-heading--sub text-white leading-[0.92]" variant="flip">
            Who stands behind <br />
            <span className="text-red-500">the move.</span>
          </TextReveal>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed pt-2">
            Firehouse doesn&apos;t stop at the truck. These are the certified operational partners that keep every job running the way it should.
          </p>
        </div>

        {/* 2 Wide Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {NETWORK_PARTNERS.map((partner) => (
            <article
              key={partner.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-red-500/50 hover:shadow-[0_50px_90px_-40px_rgba(239,68,68,0.25)]"
            >
              {/* Red Edge along Top on Hover - same accent the process cards
                  on the home page use, so this section's cards pick up the
                  same hover language instead of only the border/shadow. */}
              <span
                aria-hidden="true"
                className="bg-red-600 absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 z-10"
              />

              {/* Photo Area */}
              <div className="relative aspect-16/9 w-full overflow-hidden">
                <Image
                  src={partner.image}
                  alt={partner.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover brightness-[0.75] transition-transform duration-700 group-hover:scale-105 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/70 border border-white/15 text-red-400 backdrop-blur-md">
                  {partner.icon}
                  <span>{partner.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                    {partner.title}
                  </h3>

                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                    {partner.description}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-4 border-t border-white/[0.08] space-y-2">
                  {partner.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFleetPartnersSection;
