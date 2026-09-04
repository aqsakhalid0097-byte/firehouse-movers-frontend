'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Truck,
  Container,
  BarChart3,
  Car,
  ChevronDown,
  List,
  UserCheck,
  Wrench,
  ClipboardList,
  CheckSquare,
  Bell,
  CheckCircle2,
  Gauge,
  Fuel,
  DollarSign,
  AlertTriangle,
  Flag,
  Boxes,
  Cog,
  ShoppingCart,
  ClipboardCheck,
  Calendar,
  FileText,
  Store,
  Contact,
} from 'lucide-react';

interface InspectionSidebarProps {
  className?: string;
}

export const InspectionSidebar: React.FC<InspectionSidebarProps> = ({ className = '' }) => {
  const pathname = usePathname() || '';

  // Auto-expand sections if currently on a sub-route
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    vehicles: pathname.includes('/fleetio-vehicles') || pathname.includes('/fleetio-vehicle-assignments'),
    service: pathname.includes('/fleetio-service') || pathname.includes('/fleetio-work-orders'),
    operations: pathname.includes('/fleetio-fuel') || pathname.includes('/fleetio-meter') || pathname.includes('/fleetio-expense'),
    issues: pathname.includes('/fleetio-issues') || pathname.includes('/fleetio-issue-priorities'),
    parts: pathname.includes('/fleetio-parts') || pathname.includes('/fleetio-purchase-orders'),
    inspections: pathname.includes('/fleetio-inspection'),
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isLinkActive = (href: string) => {
    const cleanHref = href.replace(/\/$/, '');
    const cleanPath = pathname.replace(/\/$/, '');
    return cleanPath === cleanHref;
  };

  const getNavLinkClass = (href: string) => {
    const active = isLinkActive(href);
    return `block py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm font-medium ${
      active ? 'bg-red-500 text-white' : 'text-gray-200'
    }`;
  };

  const isReportsActive =
    pathname === '/inspection-report' ||
    pathname === '/inspection-report/' ||
    pathname.startsWith('/inspection-report');

  return (
    <aside
      className={`w-64 flex-shrink-0 bg-[#1a1a1a] text-white px-6 py-8 hidden md:block border-r border-[#2b2b2b]/50 ${className}`}
      data-tour-sidebar
    >
      <nav className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
        {/* Local Inspections */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <p className="text-xs text-gray-400 uppercase mb-2 px-3 font-semibold tracking-wider">
            Local Inspections
          </p>
          <Link
            href="/truck-inspection/"
            className={`flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm ${
              isLinkActive('/truck-inspection/') ? 'bg-red-500 text-white' : 'text-gray-200'
            }`}
          >
            <Truck className="w-4 h-4 mr-2.5 flex-shrink-0" />
            <span>Truck Inspection</span>
          </Link>

          <Link
            href="/trailer-inspection/"
            className={`flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm ${
              isLinkActive('/trailer-inspection/') ? 'bg-red-500 text-white' : 'text-gray-200'
            }`}
          >
            <Container className="w-4 h-4 mr-2.5 flex-shrink-0" />
            <span>Trailer Inspection</span>
          </Link>

          <Link
            href="/inspection-report/"
            className={`flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm ${
              isReportsActive ? 'bg-red-500 text-white' : 'text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2.5 flex-shrink-0" />
            <span>Reports</span>
          </Link>
        </div>

        {/* Fleetio Integration */}
        <p className="text-xs text-gray-400 uppercase mb-2 px-3 font-semibold tracking-wider">
          Fleetio Integration
        </p>

        {/* Vehicles Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('vehicles')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Vehicles</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.vehicles ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.vehicles && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-vehicles/" className={getNavLinkClass('/fleetio-vehicles/')}>
                <div className="flex items-center">
                  <List className="w-3.5 h-3.5 mr-2" />
                  <span>All Vehicles</span>
                </div>
              </Link>
              <Link href="/fleetio-vehicle-assignments/" className={getNavLinkClass('/fleetio-vehicle-assignments/')}>
                <div className="flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-2" />
                  <span>Assignments</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Service & Maintenance Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('service')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <Wrench className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Service & Maintenance</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.service ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.service && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-service-entries/" className={getNavLinkClass('/fleetio-service-entries/')}>
                <div className="flex items-center">
                  <ClipboardList className="w-3.5 h-3.5 mr-2" />
                  <span>Service Entries</span>
                </div>
              </Link>
              <Link href="/fleetio-work-orders/" className={getNavLinkClass('/fleetio-work-orders/')}>
                <div className="flex items-center">
                  <CheckSquare className="w-3.5 h-3.5 mr-2" />
                  <span>Work Orders</span>
                </div>
              </Link>
              <Link href="/fleetio-service-reminders/" className={getNavLinkClass('/fleetio-service-reminders/')}>
                <div className="flex items-center">
                  <Bell className="w-3.5 h-3.5 mr-2" />
                  <span>Service Reminders</span>
                </div>
              </Link>
              <Link href="/fleetio-service-tasks/" className={getNavLinkClass('/fleetio-service-tasks/')}>
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                  <span>Service Tasks</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Fleet Operations Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('operations')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <Gauge className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Fleet Operations</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.operations ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.operations && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-fuel-entries/" className={getNavLinkClass('/fleetio-fuel-entries/')}>
                <div className="flex items-center">
                  <Fuel className="w-3.5 h-3.5 mr-2" />
                  <span>Fuel Entries</span>
                </div>
              </Link>
              <Link href="/fleetio-meter-entries/" className={getNavLinkClass('/fleetio-meter-entries/')}>
                <div className="flex items-center">
                  <Gauge className="w-3.5 h-3.5 mr-2" />
                  <span>Meter Entries</span>
                </div>
              </Link>
              <Link href="/fleetio-expense-entries/" className={getNavLinkClass('/fleetio-expense-entries/')}>
                <div className="flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-2" />
                  <span>Expenses</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Issues Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('issues')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Issues</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.issues ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.issues && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-issues/" className={getNavLinkClass('/fleetio-issues/')}>
                <div className="flex items-center">
                  <List className="w-3.5 h-3.5 mr-2" />
                  <span>All Issues</span>
                </div>
              </Link>
              <Link href="/fleetio-issue-priorities/" className={getNavLinkClass('/fleetio-issue-priorities/')}>
                <div className="flex items-center">
                  <Flag className="w-3.5 h-3.5 mr-2" />
                  <span>Priorities</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Parts & Inventory Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('parts')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <Boxes className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Parts & Inventory</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.parts ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.parts && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-parts/" className={getNavLinkClass('/fleetio-parts/')}>
                <div className="flex items-center">
                  <Cog className="w-3.5 h-3.5 mr-2" />
                  <span>Parts</span>
                </div>
              </Link>
              <Link href="/fleetio-purchase-orders/" className={getNavLinkClass('/fleetio-purchase-orders/')}>
                <div className="flex items-center">
                  <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                  <span>Purchase Orders</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Inspections Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            onClick={() => toggleSection('inspections')}
            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm text-gray-200 cursor-pointer"
          >
            <div className="flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>Inspections</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openSections.inspections ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.inspections && (
            <div className="mt-1 space-y-1 pl-4 border-l border-red-600">
              <Link href="/fleetio-inspection-schedules/" className={getNavLinkClass('/fleetio-inspection-schedules/')}>
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  <span>Schedules</span>
                </div>
              </Link>
              <Link href="/fleetio-submitted-inspection-forms/" className={getNavLinkClass('/fleetio-submitted-inspection-forms/')}>
                <div className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-2" />
                  <span>Submitted Forms</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Other */}
        <Link
          href="/fleetio-vendors/"
          className={`flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm ${
            isLinkActive('/fleetio-vendors/') ? 'bg-red-500 text-white' : 'text-gray-200'
          }`}
        >
          <Store className="w-4 h-4 mr-2.5 flex-shrink-0" />
          <span>Vendors</span>
        </Link>

        <Link
          href="/fleetio-contacts/"
          className={`flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm ${
            isLinkActive('/fleetio-contacts/') ? 'bg-red-500 text-white' : 'text-gray-200'
          }`}
        >
          <Contact className="w-4 h-4 mr-2.5 flex-shrink-0" />
          <span>Contacts</span>
        </Link>
      </nav>
    </aside>
  );
};

export default InspectionSidebar;
