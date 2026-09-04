'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomerNavbar } from '../features/customer/CustomerNavbar';
import { CustomerWelcomeBanner } from '../features/customer/CustomerWelcomeBanner';
import { CustomerStatsGrid } from '../features/customer/CustomerStatsGrid';
import { CustomerServicesSection } from '../features/customer/CustomerServicesSection';
import { CustomerQuickActions } from '../features/customer/CustomerQuickActions';
import { CustomerRecentOrders, type CustomerOrder } from '../features/customer/CustomerRecentOrders';
import { CustomerRecentQuotes, type CustomerQuote } from '../features/customer/CustomerRecentQuotes';
import { CustomerFooter } from '../features/customer/CustomerFooter';
import { usePackagingIncomingOrders, usePackagingQuotes } from '../api/operationalApi';

export const CustomerHomePage: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.first_name || 'Valued Customer';

  const { data: incomingOrdersData } = usePackagingIncomingOrders();
  const { data: quotesData } = usePackagingQuotes();

  const orders: CustomerOrder[] = (incomingOrdersData?.orders || []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number || `ORD-${o.id}`,
    status: o.status || 'in_progress',
    order_date: o.order_date || new Date().toISOString().split('T')[0],
    total_amount: String(o.total_amount || '0.00'),
  }));

  const quotes: CustomerQuote[] = (quotesData?.quotes || []).map((q: any) => ({
    id: q.id,
    quote_number: q.quote_number || `QT-${q.id}`,
    status: q.status || 'pending',
    service_name: q.service_title || q.service_name || 'Moving & Packaging',
    created_at: q.created_at ? new Date(q.created_at).toLocaleDateString() : 'Recent',
    quoted_price: q.quoted_price ? String(q.quoted_price) : null,
  }));

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* Customer Header */}
      <CustomerNavbar notificationCount={2} />

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* Welcome Section */}
        <CustomerWelcomeBanner firstName={displayName} />

        {/* 4 Key Statistics Cards */}
        <CustomerStatsGrid
          totalOrders={orders.length}
          activeOrders={orders.filter((o) => o.status === 'in_progress' || o.status === 'confirmed').length}
          totalQuotes={quotes.length}
          pendingQuotes={quotes.filter((q) => q.status === 'pending').length}
        />

        {/* Moving Services Selection */}
        <CustomerServicesSection />

        {/* 3 Quick Actions */}
        <CustomerQuickActions />

        {/* Recent Orders List */}
        <CustomerRecentOrders orders={orders} />

        {/* Recent Quotes List */}
        <CustomerRecentQuotes quotes={quotes} />
      </main>

      {/* Customer Footer */}
      <CustomerFooter />
    </div>
  );
};

export default CustomerHomePage;
