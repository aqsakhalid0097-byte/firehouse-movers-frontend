import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomerHomePage } from '../routes/CustomerHomePage';
import { AuthenticatedLandingPage } from '../routes/AuthenticatedLandingPage';

/**
 * Checks whether the current authenticated user has a Customer role.
 */
export function isCustomerUser(user: any): boolean {
  if (!user) return false;
  if (user.is_customer === true) return true;
  if (typeof user.role === 'object' && user.role !== null) {
    if (user.role.is_customer === true) return true;
    if (user.role.name && user.role.name.toLowerCase().includes('customer')) return true;
  }
  if (typeof user.role === 'string' && user.role.toLowerCase().includes('customer')) {
    return true;
  }
  return false;
}

/**
 * RoleBasedDashboard routes authenticated users to their designated landing page:
 * - Customers -> Customer Portal Dashboard (with stats, services, quick actions, quotes & orders)
 * - Drivers / Staff / Movers -> Operations Landing Page (with quick stats and service cards with pictures)
 */
export const RoleBasedDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isCustomerUser(user)) {
    return <CustomerHomePage />;
  }

  return <AuthenticatedLandingPage />;
};

export default RoleBasedDashboard;
