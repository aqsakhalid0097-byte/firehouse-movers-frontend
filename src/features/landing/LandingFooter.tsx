'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#0e0e0e] text-gray-400 text-xs border-t border-neutral-800">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/fire_house_logo.svg"
                alt="Firehouse Movers Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-extrabold text-white tracking-wider">FIREHOUSE MOVERS</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Firefighter owned and operated moving company based in Lewisville, TX. Delivering strength, discipline, and five-star customer care across Texas since 2004.
            </p>
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
              <Phone className="w-4 h-4" />
              <span>(972) 539-9588</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Firehouse</Link></li>
              <li><Link href="/journey" className="hover:text-white transition">Move Lifecycle Journey</Link></li>
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#estimate-calculator" className="hover:text-white transition">Move Calculator</a></li>
              <li><Link href="/login" className="hover:text-white transition">Staff & Customer Portal</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Moving Services</h4>
            <ul className="space-y-2.5">
              <li><span className="text-gray-300">Residential Moves</span></li>
              <li><span className="text-gray-300">Commercial Relocations</span></li>
              <li><span className="text-gray-300">Packing & Crating</span></li>
              <li><span className="text-gray-300">Station Vault Storage</span></li>
              <li><span className="text-gray-300">Piano & Heavy Safes</span></li>
            </ul>
          </div>

          {/* Service Areas & Stations */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Stations & Service Area</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>Station 1 & Station 2 (Lewisville, TX)</span>
              </li>
              <li><span>Dallas / Fort Worth Metro</span></li>
              <li><span>Frisco, Plano, McKinney</span></li>
              <li><span>Austin, Houston & Statewide TX</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-900 bg-[#080808] py-6 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved. TXDMV No. 006492023C</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Licensed & Insured</span>
            <span className="text-gray-400">Better Business Bureau A+</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
