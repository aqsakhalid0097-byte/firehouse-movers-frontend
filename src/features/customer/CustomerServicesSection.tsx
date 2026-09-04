import React from 'react';
import { Route, Warehouse, Package, Home, Building2, Truck } from 'lucide-react';

export interface CustomerServiceItem {
  id: number;
  name: string;
  icon: React.ElementType;
}

export const CustomerServicesSection: React.FC = () => {
  const services = [
    { id: 1, name: 'Long Distance Moves', icon: Route },
    { id: 2, name: 'Storage Solutions', icon: Warehouse },
    { id: 3, name: 'Packing Services', icon: Package },
    { id: 4, name: 'Residential Moves', icon: Home },
    { id: 5, name: 'Commercial Moves', icon: Building2 },
  ];

  return (
    <div className="bg-[#1a1a1a] border border-gray-800/90 rounded-xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Truck className="w-5 h-5 text-red-500" />
          Our Moving Services
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <a
              key={service.id}
              href="#request-quote"
              className="flex flex-col items-center justify-center p-5 bg-[#0f0f0f] border border-gray-800 rounded-xl hover:border-red-500/80 hover:bg-[#1a1a1a] transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <Icon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 text-center group-hover:text-white transition-colors">
                {service.name}
              </h3>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerServicesSection;
