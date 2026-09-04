'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Truck, ClipboardCheck } from 'lucide-react';

export const InspectionsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap cursor-pointer uppercase font-semibold"
      >
        <span>INSPECTIONS</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-[#262626] border border-gray-700 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <Link
            href="/truck-inspection/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 hover:bg-red-600 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Truck className="w-4 h-4 text-red-400" />
            <span>Vehicle Inspection</span>
          </Link>
          <Link
            href="/onsite-inspection/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 hover:bg-red-600 hover:text-white transition-colors border-t border-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <ClipboardCheck className="w-4 h-4 text-red-400" />
            <span>On-Site Inspection</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default InspectionsDropdown;
