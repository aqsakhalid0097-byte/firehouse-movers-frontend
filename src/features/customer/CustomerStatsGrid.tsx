import React from 'react';
import { Box, Truck, FileText, Clock } from 'lucide-react';

export interface CustomerStatsProps {
  totalOrders?: number;
  activeOrders?: number;
  totalQuotes?: number;
  pendingQuotes?: number;
}

export const CustomerStatsGrid: React.FC<CustomerStatsProps> = ({
  totalOrders = 0,
  activeOrders = 0,
  totalQuotes = 0,
  pendingQuotes = 0,
}) => {
  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Box,
      iconColor: 'text-red-500',
      bgGlow: 'bg-red-500/20',
      hoverBorder: 'hover:border-red-500/40',
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      icon: Truck,
      iconColor: 'text-blue-500',
      bgGlow: 'bg-blue-500/20',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      title: 'Quote Requests',
      value: totalQuotes,
      icon: FileText,
      iconColor: 'text-purple-500',
      bgGlow: 'bg-purple-500/20',
      hoverBorder: 'hover:border-purple-500/40',
    },
    {
      title: 'Pending Quotes',
      value: pendingQuotes,
      icon: Clock,
      iconColor: 'text-yellow-500',
      bgGlow: 'bg-yellow-500/20',
      hoverBorder: 'hover:border-yellow-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-[#1a1a1a] border border-gray-800/90 rounded-xl p-6 ${stat.hoverBorder} transition-all duration-300 shadow-xl hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgGlow} p-3 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStatsGrid;
