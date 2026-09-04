import React from 'react';
import { Phone, MapPin } from 'lucide-react';

interface AuthBannerProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  phone?: string;
  address?: string;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({
  imageSrc = '/images/IMG_2045.jpg',
  title = 'Move with Confidence',
  subtitle = 'Trusted by thousands, we deliver with care, precision, and speed. Be part of the force that keeps homes moving.',
  phone = '(972) 992-1969',
  address = '2535-B E. State Hwy 121, Suite 140\nLewisville, TX 75056',
}) => {
  return (
    <div className="relative hidden lg:block h-screen overflow-hidden">
      <img
        src={imageSrc}
        alt="Firehouse Movers Team"
        className="w-full h-full object-cover opacity-75 transform hover:scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-12 lg:p-16">
        <div className="max-w-xl">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-wide">
            {title}
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed font-normal">{subtitle}</p>

          <div className="mt-8 pt-8 border-t border-white/15 space-y-3">
            <h3 className="text-lg font-bold text-white mb-3">Contact Us</h3>
            <p className="text-gray-300 text-sm flex items-center gap-3">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-red-400 transition-colors">
                {phone}
              </a>
            </p>
            <p className="text-gray-300 text-sm flex items-start gap-3 leading-relaxed">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{address}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
