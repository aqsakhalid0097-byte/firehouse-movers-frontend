import React from 'react';
import Link from 'next/link';

export interface AuthServiceCardProps {
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  linkTo: string;
  iconSvg: React.ReactNode;
  badgeColorClass?: string;
}

export const AuthServiceCard: React.FC<AuthServiceCardProps> = ({
  title,
  category,
  description,
  imageSrc,
  linkTo,
  iconSvg,
  badgeColorClass = 'bg-red-500/20',
}) => {
  return (
    <Link
      href={linkTo}
      className="service-card group relative overflow-hidden rounded-xl bg-[#262626] border border-gray-700 hover:border-gray-500 transition-all duration-300 shadow-2xl block h-64 sm:h-72 hover:-translate-y-1"
    >
      <div className="relative h-full w-full">
        {/* Crisp & Bright Background Image */}
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-105 group-hover:opacity-25 z-10 transition-all duration-300"
        />

        {/* Subtle Bottom Vignette for text legibility without dimming image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-15 pointer-events-none group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges (Cornered and only visible on hover) */}
        <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 z-20 flex items-center justify-between pointer-events-none">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 ${badgeColorClass} backdrop-blur-md rounded-md sm:rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-md`}>
            {iconSvg}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-300 font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
            {category}
          </span>
        </div>

        {/* Bottom Text Content (Strictly aligned across all cards in the row) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 pointer-events-none">
          <div className="flex flex-col justify-end">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-white transition-colors drop-shadow-md leading-tight min-h-[2.75rem] sm:min-h-[3rem] flex items-end">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed drop-shadow max-h-0 opacity-0 overflow-hidden group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-1.5 transition-all duration-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuthServiceCard;
