import React from 'react';
import { Box, ArrowRight, Clock, Check, Truck, CheckCircle2, XCircle, Calendar, DollarSign, PackageOpen } from 'lucide-react';

export interface CustomerOrder {
  id: number | string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  order_date: string;
  total_amount: number | string;
}

interface CustomerRecentOrdersProps {
  orders?: CustomerOrder[];
}

export const CustomerRecentOrders: React.FC<CustomerRecentOrdersProps> = ({
  orders = [],
}) => {
  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800/90 rounded-xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Box className="w-6 h-6 text-red-500" />
          Recent Orders
        </h2>
        {orders.length > 0 && (
          <a
            href="#my-orders"
            className="text-red-500 hover:text-red-400 text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#262626] border border-gray-800 hover:border-red-500/40 rounded-xl p-5 transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-white font-bold text-base tracking-wide">
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {order.order_date}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                      <DollarSign className="w-4 h-4 text-red-400" />
                      Total: ${order.total_amount}
                    </span>
                  </div>
                </div>
                <div>
                  <a
                    href={`#order-${order.id}`}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-10 text-center space-y-3">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <PackageOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">No Orders Yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Start by requesting a quote for your upcoming residential or commercial move.
          </p>
          <div className="pt-2">
            <a
              href="#request-quote"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-600/20 cursor-pointer"
            >
              Request Quote
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRecentOrders;
