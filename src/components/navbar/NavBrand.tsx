import React from 'react';
import Link from 'next/link';

export const NavBrand: React.FC = () => {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative">
          <img
            src="/images/fire_house_logo.svg"
            alt="Firehouse Movers Seal"
            className="w-9 sm:w-10 h-9 sm:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-black"></div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-white text-sm xs:text-base sm:text-lg tracking-wider">FIREHOUSE</span>
            <span className="font-black text-red-500 text-sm xs:text-base sm:text-lg tracking-wider">MOVERS</span>
          </div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 hidden sm:block">
            Texas Fleet & Logistics
          </span>
        </div>
      </Link>
    </div>
  );
};

export default NavBrand;
