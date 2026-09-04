'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { InspectionsDropdown } from './InspectionsDropdown';

interface NavLinksProps {
  notificationCount?: number;
}

export const NavLinks: React.FC<NavLinksProps> = ({ notificationCount = 0 }) => {
  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-semibold tracking-wider text-gray-200 uppercase">
      <Link
        href="/vehicle/vehicle-availability/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        AVAILABILITY & LOGISTICS
      </Link>
      <Link
        href="/station/report/1/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        STATIONS
      </Link>

      <InspectionsDropdown />

      <Link
        href="/inventory/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        INVENTORY
      </Link>
      <Link
        href="/awards/gifts/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        GIFT
      </Link>
      <Link
        href="/packaging/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        PACKAGING
      </Link>
      <Link
        href="/dispatch/"
        className="hover:text-white transition-colors hover:border-b-2 hover:border-white py-1 whitespace-nowrap"
      >
        DISPATCH
      </Link>

      <button
        className="relative p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer ml-1"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {notificationCount}
          </span>
        )}
      </button>
    </nav>
  );
};

export default NavLinks;
