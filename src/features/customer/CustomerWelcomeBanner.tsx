import React from 'react';

interface CustomerWelcomeBannerProps {
  firstName: string;
}

export const CustomerWelcomeBanner: React.FC<CustomerWelcomeBannerProps> = ({ firstName }) => {
  return (
    <div className="bg-gradient-to-r from-red-500/15 via-red-950/20 to-transparent border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
      <h1 className="animate-heading text-2xl sm:text-3xl font-bold text-white mb-1.5">
        Welcome back, <span className="text-red-500">{firstName}</span>!
      </h1>
      <p className="text-gray-400 text-sm sm:text-base">
        Here's an overview of your moving services, orders, and quote requests.
      </p>
    </div>
  );
};

export default CustomerWelcomeBanner;
