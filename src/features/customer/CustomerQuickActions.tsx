import React from 'react';
import { Calculator, ListOrdered, FileText } from 'lucide-react';

export const CustomerQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Request New Quote */}
      <a
        href="#request-quote"
        className="bg-red-600 hover:bg-red-500 text-white p-6 sm:p-7 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-red-600/25 flex flex-col items-center justify-center text-center group cursor-pointer"
      >
        <Calculator className="w-8 h-8 sm:w-9 sm:h-9 mb-3 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="font-bold text-lg text-white">Request New Quote</h3>
        <p className="text-sm text-red-100/90 mt-1">Get a custom quote for your move</p>
      </a>

      {/* View All Orders */}
      <a
        href="#my-orders"
        className="bg-[#1a1a1a] border-2 border-red-500/30 hover:border-red-500 text-white p-6 sm:p-7 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-black flex flex-col items-center justify-center text-center group cursor-pointer"
      >
        <ListOrdered className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-red-500 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="font-bold text-lg text-white">View All Orders</h3>
        <p className="text-sm text-gray-400 mt-1">Track your moving orders</p>
      </a>

      {/* View All Quotes */}
      <a
        href="#my-quotes"
        className="bg-[#1a1a1a] border-2 border-red-500/30 hover:border-red-500 text-white p-6 sm:p-7 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-black flex flex-col items-center justify-center text-center group cursor-pointer"
      >
        <FileText className="w-8 h-8 sm:w-9 sm:h-9 mb-3 text-red-500 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="font-bold text-lg text-white">View All Quotes</h3>
        <p className="text-sm text-gray-400 mt-1">Manage your quote requests</p>
      </a>
    </div>
  );
};

export default CustomerQuickActions;
