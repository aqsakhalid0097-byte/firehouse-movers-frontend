import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="border-t border-gray-800/90 bg-gradient-to-b from-[#141414] to-[#0a0a0a] text-gray-400 py-12 px-6 sm:px-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md">
              F
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">Firehouse Movers</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
            Firehouse Movers Inc. is a fast-growing franchise moving company offering full moving services to residents and businesses across the state.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Licensed & Insured Moving Professionals</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Headquarters</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>2535-B Texas 121 E, Suite #140, Lewisville, TX 75056</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <span>(972) 992-1969</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <span>support@firehousemovers.com</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Resources</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <a href="#request-quote" className="hover:text-white transition-colors">Request a Move Quote</a>
            </li>
            <li>
              <a href="#my-orders" className="hover:text-white transition-colors">Track Orders</a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved.</p>
        <p className="text-gray-500">Customer Site & Moving Portal</p>
      </div>
    </footer>
  );
};

export default CustomerFooter;
