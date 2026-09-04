'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LandingPage } from './LandingPage';
import { AuthenticatedLandingPage } from './AuthenticatedLandingPage';
import { CustomerHomePage } from './CustomerHomePage';
import { isCustomerUser } from '../components/RoleBasedDashboard';

/**
 * RootPage matches Django's homeview behavior at '/':
 * - Unauthenticated visitors -> Public Marketing Landing Page (LandingPage)
 * - Authenticated Drivers / Movers / Staff -> Operations Landing Page with pictures (AuthenticatedLandingPage) at '/'
 * - Authenticated Customers -> Customer Portal Page (CustomerHomePage)
 */
export const RootPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (isCustomerUser(user)) {
    return <CustomerHomePage />;
  }

  return <AuthenticatedLandingPage />;
};

export default RootPage;
