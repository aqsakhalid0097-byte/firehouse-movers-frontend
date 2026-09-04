'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Warehouse,
  ChevronDown,
  Box,
  ClipboardCheck,
  Truck,
  ClipboardList,
  Wrench,
  Boxes,
  Container,
  BarChart3,
  CheckCircle2,
  PackageOpen,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

type ReportTab = 'order_report' | 'vehicle_report' | 'station_overview' | 'station_summary';

type StationSubView =
  | 'report'
  | 'vaults'
  | 'station_inspection'
  | 'station_vehicles'
  | 'order_fleet'
  | 'order_office'
  | 'service_truck'
  | 'service_trailer';

interface OrderItem {
  id: string;
  date: string;
  requested_by: string;
  item_description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  station_number: 1 | 2;
  order_type: 'fleet' | 'office_supplies';
}

interface InspectionItem {
  id: string;
  date: string;
  vehicle: string;
  type: string;
  description: string;
  technician: string;
  station_number: 1 | 2;
  vehicle_category: 'truck' | 'trailer';
}

interface StationOverviewData {
  date: string;
  inventory_status: string;
  missing_tools: string;
}

interface StationSummaryRecord {
  id: string;
  date: string;
  back_lot_cleanliness: string;
  back_lot_maintenance: string;
  front_yard_cleanliness: string;
  front_yard_landscaping: string;
  inventory_status: string;
  missing_tools: string;
}

const mockFleetOrders: OrderItem[] = [];
const mockOfficeOrders: OrderItem[] = [];

const mockTruckInspections: InspectionItem[] = [
  {
    id: '1',
    date: '2026-08-20',
    vehicle: 'Truck 101',
    type: 'Oil Change & Brake Inspection',
    description: 'Replaced oil filters, brake pad depth checked at 9mm.',
    technician: 'Dave Mitchell',
    station_number: 1,
    vehicle_category: 'truck',
  },
  {
    id: '2',
    date: '2026-08-18',
    vehicle: 'Truck 102',
    type: 'Tire Rotation',
    description: 'Rotated front & rear duals, tire pressure at 105 PSI.',
    technician: 'Carlos Rodriguez',
    station_number: 1,
    vehicle_category: 'truck',
  },
];

const mockTrailerInspections: InspectionItem[] = [
  {
    id: '1',
    date: '2026-08-22',
    vehicle: 'Trailer 201',
    type: 'Door Latch & Ramp Inspection',
    description: 'Lubricated roll-up door springs, inspected hitch ball mount.',
    technician: 'Marcus Vance',
    station_number: 1,
    vehicle_category: 'trailer',
  },
];

const mockStation1Overview: StationOverviewData = {
  date: '24/08/2026',
  inventory_status: 'Complete (100%)',
  missing_tools: 'None',
};

const mockStation2Overview: StationOverviewData = {
  date: '23/08/2026',
  inventory_status: 'Audit Pending',
  missing_tools: 'None',
};

const mockStationSummaries: StationSummaryRecord[] = [
  {
    id: '1',
    date: '24/08/2026',
    back_lot_cleanliness: 'Clean',
    back_lot_maintenance: 'Good',
    front_yard_cleanliness: 'Clean',
    front_yard_landscaping: 'Maintained',
    inventory_status: 'Complete',
    missing_tools: 'None',
  },
  {
    id: '2',
    date: '17/08/2026',
    back_lot_cleanliness: 'Clean',
    back_lot_maintenance: 'Good',
    front_yard_cleanliness: 'Clean',
    front_yard_landscaping: 'Maintained',
    inventory_status: 'Complete',
    missing_tools: 'None',
  },
];

export const StationReportPage: React.FC = () => {
  const { user, logout } = useAuth();
  const params = useParams<{ stationId?: string }>();
  const stationId = params?.stationId || '1';
  const router = useRouter();

  const currentStationNumber: 1 | 2 = stationId === '2' ? 2 : 1;

  // Sidebar collapsible state
  const [station1Open, setStation1Open] = useState(currentStationNumber === 1);
  const [station2Open, setStation2Open] = useState(currentStationNumber === 2);
  const [s1FleetOpen, setS1FleetOpen] = useState(false);
  const [s1OrderOpen, setS1OrderOpen] = useState(false);
  const [s1MgmtOpen, setS1MgmtOpen] = useState(false);
  const [s2FleetOpen, setS2FleetOpen] = useState(false);
  const [s2OrderOpen, setS2OrderOpen] = useState(false);
  const [s2MgmtOpen, setS2MgmtOpen] = useState(false);

  // Active view and tab
  const [currentSubView, setCurrentSubView] = useState<StationSubView>('report');
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>('order_report');

  // Date filters
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-25');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentStationNumber === 1) {
      setStation1Open(true);
    } else {
      setStation2Open(true);
    }
  }, [currentStationNumber]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectStation = (num: 1 | 2) => {
    router.push(`/station/report/${num}/`);
    setCurrentSubView('report');
    if (num === 1) {
      setStation1Open(true);
    } else {
      setStation2Open(true);
    }
  };

  const handleResetDates = () => {
    setStartDate('2026-08-25');
    setEndDate('2026-08-25');
    showToast('Report dates reset.');
  };

  const handleUpdateReport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Report updated for ${startDate} to ${endDate}.`);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      {/* Top Navbar */}
      <header className="print:hidden">
        <Navbar isAuthenticated={true} user={user} onLogout={logout} />
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout with Left Sidebar matching station_base.html */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside
          className="w-64 flex-shrink-0 bg-[#1a1a1a] text-white px-6 py-8 hidden md:block print:hidden"
          data-tour-sidebar
        >
          <nav className="space-y-4">
            {/* Station 1 Dropdown */}
            <div className="sidebar-section">
              <button
                type="button"
                onClick={() => {
                  setStation1Open(!station1Open);
                  if (currentStationNumber !== 1) handleSelectStation(1);
                }}
                className={`w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer ${
                  currentStationNumber === 1 ? 'bg-red-500 font-semibold' : ''
                }`}
              >
                <div className="flex items-center">
                  <Warehouse className="w-5 h-5 mr-2" />
                  <span>Station 1</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    station1Open ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Station 1 Sub-items */}
              {station1Open && (
                <div className="mt-2 space-y-1 pl-4 border-l-2 border-red-500/30">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(1);
                      setCurrentSubView('vaults');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 1 && currentSubView === 'vaults' ? 'bg-red-500' : ''
                    }`}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    <span>Vaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(1);
                      setCurrentSubView('station_inspection');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 1 && currentSubView === 'station_inspection'
                        ? 'bg-red-500'
                        : ''
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    <span>Station Inspection</span>
                  </button>

                  {/* Fleet Nested Dropdown */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setS1FleetOpen(!s1FleetOpen)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 text-left text-sm cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        <span>Fleet</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          s1FleetOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {s1FleetOpen && (
                      <div className="ml-4 space-y-1 border-l-2 border-red-500/20 pl-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectStation(1);
                            setCurrentSubView('station_vehicles');
                          }}
                          className={`w-full text-left flex items-center py-1.5 px-2 rounded hover:bg-red-500 text-xs cursor-pointer ${
                            currentStationNumber === 1 && currentSubView === 'station_vehicles'
                              ? 'bg-red-500'
                              : ''
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5 mr-1.5" />
                          <span>Trucks & Trailers</span>
                        </button>

                        {/* Request Order List Nested Dropdown */}
                        <div>
                          <button
                            type="button"
                            onClick={() => setS1OrderOpen(!s1OrderOpen)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-red-500 text-left text-xs cursor-pointer"
                          >
                            <div className="flex items-center">
                              <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                              <span>Request Order List</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-200 ${
                                s1OrderOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {s1OrderOpen && (
                            <div className="ml-3 space-y-1 border-l border-red-500/20 pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(1);
                                  setCurrentSubView('order_fleet');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                <span>Fleet Orders</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(1);
                                  setCurrentSubView('order_office');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Boxes className="w-3 h-3 mr-1" />
                                <span>Office Supplies</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Fleet Management & Service Nested Dropdown */}
                        <div>
                          <button
                            type="button"
                            onClick={() => setS1MgmtOpen(!s1MgmtOpen)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-red-500 text-left text-xs cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Wrench className="w-3.5 h-3.5 mr-1.5" />
                              <span>Fleet Mgmt & Service</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-200 ${
                                s1MgmtOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {s1MgmtOpen && (
                            <div className="ml-3 space-y-1 border-l border-red-500/20 pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(1);
                                  setCurrentSubView('service_truck');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                <span>Truck Service</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(1);
                                  setCurrentSubView('service_trailer');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Container className="w-3 h-3 mr-1" />
                                <span>Trailer Service</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(1);
                      setCurrentSubView('report');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 1 && currentSubView === 'report' ? 'bg-red-500' : ''
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>Reports</span>
                  </button>
                </div>
              )}
            </div>

            {/* Station 2 Dropdown */}
            <div className="sidebar-section">
              <button
                type="button"
                onClick={() => {
                  setStation2Open(!station2Open);
                  if (currentStationNumber !== 2) handleSelectStation(2);
                }}
                className={`w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer ${
                  currentStationNumber === 2 ? 'bg-red-500 font-semibold' : ''
                }`}
              >
                <div className="flex items-center">
                  <Warehouse className="w-5 h-5 mr-2" />
                  <span>Station 2</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    station2Open ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Station 2 Sub-items */}
              {station2Open && (
                <div className="mt-2 space-y-1 pl-4 border-l-2 border-red-500/30">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(2);
                      setCurrentSubView('vaults');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 2 && currentSubView === 'vaults' ? 'bg-red-500' : ''
                    }`}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    <span>Vaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(2);
                      setCurrentSubView('station_inspection');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 2 && currentSubView === 'station_inspection'
                        ? 'bg-red-500'
                        : ''
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    <span>Station Inspection</span>
                  </button>

                  {/* Fleet Nested Dropdown */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setS2FleetOpen(!s2FleetOpen)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-red-500 text-left text-sm cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        <span>Fleet</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          s2FleetOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {s2FleetOpen && (
                      <div className="ml-4 space-y-1 border-l-2 border-red-500/20 pl-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectStation(2);
                            setCurrentSubView('station_vehicles');
                          }}
                          className={`w-full text-left flex items-center py-1.5 px-2 rounded hover:bg-red-500 text-xs cursor-pointer ${
                            currentStationNumber === 2 && currentSubView === 'station_vehicles'
                              ? 'bg-red-500'
                              : ''
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5 mr-1.5" />
                          <span>Trucks & Trailers</span>
                        </button>

                        {/* Request Order List Nested Dropdown */}
                        <div>
                          <button
                            type="button"
                            onClick={() => setS2OrderOpen(!s2OrderOpen)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-red-500 text-left text-xs cursor-pointer"
                          >
                            <div className="flex items-center">
                              <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                              <span>Request Order List</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-200 ${
                                s2OrderOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {s2OrderOpen && (
                            <div className="ml-3 space-y-1 border-l border-red-500/20 pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(2);
                                  setCurrentSubView('order_fleet');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                <span>Fleet Orders</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(2);
                                  setCurrentSubView('order_office');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Boxes className="w-3 h-3 mr-1" />
                                <span>Office Supplies</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Fleet Management & Service Nested Dropdown */}
                        <div>
                          <button
                            type="button"
                            onClick={() => setS2MgmtOpen(!s2MgmtOpen)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-red-500 text-left text-xs cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Wrench className="w-3.5 h-3.5 mr-1.5" />
                              <span>Fleet Mgmt & Service</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-200 ${
                                s2MgmtOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {s2MgmtOpen && (
                            <div className="ml-3 space-y-1 border-l border-red-500/20 pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(2);
                                  setCurrentSubView('service_truck');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                <span>Truck Service</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectStation(2);
                                  setCurrentSubView('service_trailer');
                                }}
                                className="w-full text-left flex items-center py-1 px-2 rounded hover:bg-red-500 text-xs cursor-pointer"
                              >
                                <Container className="w-3 h-3 mr-1" />
                                <span>Trailer Service</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStation(2);
                      setCurrentSubView('report');
                    }}
                    className={`w-full text-left flex items-center py-2 px-3 rounded hover:bg-red-500 transition-colors text-sm cursor-pointer ${
                      currentStationNumber === 2 && currentSubView === 'report' ? 'bg-red-500' : ''
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>Reports</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content matching exact screenshot and report.html / base_template.html */}
        <main className="flex-1 bg-black text-white p-4 md:p-6 overflow-y-auto min-w-0" data-tour-main>
          {/* Top Title */}
          <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6 text-left">
            Station {currentStationNumber} - Reports
          </h1>

          {/* =========================================================================
           * PRIMARY VIEW: STATION REPORTS (report.html & screenshot)
           * ========================================================================= */}
          {currentSubView === 'report' && (
            <div>
              {/* Navigation Tabs matching screenshot */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveReportTab('order_report')}
                  className={`py-2 px-5 transition-all duration-300 text-white rounded font-medium cursor-pointer text-sm ${
                    activeReportTab === 'order_report'
                      ? 'bg-red-500'
                      : 'bg-[#262626] hover:bg-[#333333]'
                  }`}
                >
                  Order Status
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('vehicle_report')}
                  className={`py-2 px-5 transition-all duration-300 text-white rounded font-medium cursor-pointer text-sm ${
                    activeReportTab === 'vehicle_report'
                      ? 'bg-red-500'
                      : 'bg-[#262626] hover:bg-[#333333]'
                  }`}
                >
                  Vehicle Service
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('station_overview')}
                  className={`py-2 px-5 transition-all duration-300 text-white rounded font-medium cursor-pointer text-sm ${
                    activeReportTab === 'station_overview'
                      ? 'bg-red-500'
                      : 'bg-[#262626] hover:bg-[#333333]'
                  }`}
                >
                  Station Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('station_summary')}
                  className={`py-2 px-5 transition-all duration-300 text-white rounded font-medium cursor-pointer text-sm ${
                    activeReportTab === 'station_summary'
                      ? 'bg-red-500'
                      : 'bg-[#262626] hover:bg-[#333333]'
                  }`}
                >
                  Station Summary
                </button>
              </div>

              {/* Date Filters Card matching screenshot */}
              <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6 mb-6">
                <form
                  onSubmit={handleUpdateReport}
                  className="flex flex-wrap items-end justify-start gap-4"
                >
                  <div className="flex flex-col">
                    <label htmlFor="start_date_input" className="text-sm font-medium text-gray-400 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start_date_input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-[#262626] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="end_date_input" className="text-sm font-medium text-gray-400 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end_date_input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-[#262626] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white px-6 py-2 rounded-lg font-medium cursor-pointer text-sm shadow"
                  >
                    Update Report
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDates}
                    className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 text-white px-6 py-2 rounded-lg font-medium cursor-pointer text-sm"
                  >
                    Reset Dates
                  </button>
                </form>
              </div>

              {/* Tab 1: Order Status (matching screenshot) */}
              {activeReportTab === 'order_report' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Fleet Orders Summary Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Fleet Orders Summary</h3>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                          {mockFleetOrders.length}
                        </div>
                        <div className="text-xs text-gray-400">Total Orders</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                          {mockFleetOrders.filter((o) => o.status === 'Pending').length}
                        </div>
                        <div className="text-xs text-gray-400">Pending</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {mockFleetOrders.filter((o) => o.status === 'Approved').length}
                        </div>
                        <div className="text-xs text-gray-400">Approved</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                          {mockFleetOrders.filter((o) => o.status === 'Rejected').length}
                        </div>
                        <div className="text-xs text-gray-400">Rejected</div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Requested By
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {mockFleetOrders.length > 0 ? (
                            mockFleetOrders.map((order) => (
                              <tr key={order.id}>
                                <td className="px-4 py-3 text-sm text-white">{order.date}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{order.requested_by}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{order.item_description}</td>
                                <td className="px-4 py-3 text-sm text-center">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      order.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : order.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                <PackageOpen className="w-10 h-10 mb-2 mx-auto text-gray-500" />
                                No fleet orders available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Office Supply Orders Summary Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Office Supply Orders Summary</h3>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                          {mockOfficeOrders.length}
                        </div>
                        <div className="text-xs text-gray-400">Total Orders</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                          {mockOfficeOrders.filter((o) => o.status === 'Pending').length}
                        </div>
                        <div className="text-xs text-gray-400">Pending</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {mockOfficeOrders.filter((o) => o.status === 'Approved').length}
                        </div>
                        <div className="text-xs text-gray-400">Approved</div>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">
                          {mockOfficeOrders.filter((o) => o.status === 'Rejected').length}
                        </div>
                        <div className="text-xs text-gray-400">Rejected</div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Requested By
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {mockOfficeOrders.length > 0 ? (
                            mockOfficeOrders.map((order) => (
                              <tr key={order.id}>
                                <td className="px-4 py-3 text-sm text-white">{order.date}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{order.requested_by}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{order.item_description}</td>
                                <td className="px-4 py-3 text-sm text-center">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      order.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : order.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                <PackageOpen className="w-10 h-10 mb-2 mx-auto text-gray-500" />
                                No office supply orders available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Vehicle Service (vehicle_report) */}
              {activeReportTab === 'vehicle_report' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Truck Service Summary Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Truck Service Summary</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Truck</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Service Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Description</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Technician</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {mockTruckInspections.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-white">{item.date}</td>
                              <td className="px-4 py-3 text-gray-300 font-medium">{item.vehicle}</td>
                              <td className="px-4 py-3 text-gray-300">{item.type}</td>
                              <td className="px-4 py-3 text-gray-400">{item.description}</td>
                              <td className="px-4 py-3 text-gray-300">{item.technician}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trailer Service Summary Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Trailer Service Summary</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Trailer</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Service Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Description</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-400">Technician</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {mockTrailerInspections.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-white">{item.date}</td>
                              <td className="px-4 py-3 text-gray-300 font-medium">{item.vehicle}</td>
                              <td className="px-4 py-3 text-gray-300">{item.type}</td>
                              <td className="px-4 py-3 text-gray-400">{item.description}</td>
                              <td className="px-4 py-3 text-gray-300">{item.technician}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Station Overview (station_overview) */}
              {activeReportTab === 'station_overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Station 1 Overview Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Station 1 Overview</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Last Inspection</p>
                        <p className="text-lg font-semibold text-white">{mockStation1Overview.date}</p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Issues Requiring Attention</p>
                        <p className="text-lg font-semibold text-yellow-400">None</p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Tools Area Inventory</p>
                        <p className="text-lg font-semibold text-white">
                          {mockStation1Overview.inventory_status}
                        </p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Missing Tools</p>
                        <p className="text-lg font-semibold text-white">
                          {mockStation1Overview.missing_tools}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Station 2 Overview Card */}
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                      <h3 className="text-xl font-semibold text-white">Station 2 Overview</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Last Inspection</p>
                        <p className="text-lg font-semibold text-white">{mockStation2Overview.date}</p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Issues Requiring Attention</p>
                        <p className="text-lg font-semibold text-yellow-400">None</p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Tools Area Inventory</p>
                        <p className="text-lg font-semibold text-white">
                          {mockStation2Overview.inventory_status}
                        </p>
                      </div>
                      <div className="bg-[#262626] rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Missing Tools</p>
                        <p className="text-lg font-semibold text-white">
                          {mockStation2Overview.missing_tools}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Station Summary (station_summary) */}
              {activeReportTab === 'station_summary' && (
                <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Station Summary</h3>
                  </div>

                  <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">Date</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Back Lot Cleanliness
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Back Lot Maintenance
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Front Yard Cleanliness
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Front Yard Landscaping
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Tool Inventory
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-400">
                            Missing Tools
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {mockStationSummaries.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-white">{item.date}</td>
                            <td className="px-4 py-3 text-gray-300">{item.back_lot_cleanliness}</td>
                            <td className="px-4 py-3 text-gray-300">{item.back_lot_maintenance}</td>
                            <td className="px-4 py-3 text-gray-300">{item.front_yard_cleanliness}</td>
                            <td className="px-4 py-3 text-gray-300">{item.front_yard_landscaping}</td>
                            <td className="px-4 py-3 text-gray-300">{item.inventory_status}</td>
                            <td className="px-4 py-3 text-gray-300">{item.missing_tools}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
           * SUBVIEW: VAULTS (excel_station_1)
           * ========================================================================= */}
          {currentSubView === 'vaults' && (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station {currentStationNumber} - Vaults Inventory
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Vault storage units and customer assignment grid for Station {currentStationNumber}.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#262626] border border-gray-700 p-4 rounded-lg text-center hover:border-red-500 transition-colors"
                  >
                    <p className="text-xs text-gray-400">Vault</p>
                    <p className="text-lg font-bold text-white">#{100 + i + (currentStationNumber === 2 ? 100 : 0)}</p>
                    <span className="text-[10px] text-green-400 font-semibold uppercase mt-1 block">
                      {i % 4 === 0 ? 'Assigned' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
           * SUBVIEW: STATION INSPECTION (station_inspection.html)
           * ========================================================================= */}
          {currentSubView === 'station_inspection' && (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station {currentStationNumber} - Facility Inspection Audit
              </h2>
              <div className="space-y-4">
                {[
                  'Front Parking Lot & Entry Gate Security',
                  'Office Dispatch Bay Terminals & Communication Equipment',
                  'Loading Dock Rails & Hydraulic Liftgates',
                  'Tool Room Inventory & Safety Lockers',
                  'Fire Extinguishers & Emergency First-Aid Kits',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#262626] p-4 rounded-lg border border-gray-700"
                  >
                    <span className="text-white text-sm font-medium">{item}</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/40">
                      Passed Inspection
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
           * SUBVIEW: TRUCKS & TRAILERS (station_vehicles.html)
           * ========================================================================= */}
          {currentSubView === 'station_vehicles' && (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station {currentStationNumber} - Assigned Fleet
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="px-4 py-3 text-left">Unit #</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Capacity</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold">Truck 101</td>
                      <td className="px-4 py-3 text-gray-400">26ft Box Truck</td>
                      <td className="px-4 py-3">1,700 cu ft</td>
                      <td className="px-4 py-3 text-green-400 font-semibold">In Service</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold">Truck 102</td>
                      <td className="px-4 py-3 text-gray-400">24ft Box Truck</td>
                      <td className="px-4 py-3">1,500 cu ft</td>
                      <td className="px-4 py-3 text-green-400 font-semibold">In Service</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold">Trailer 201</td>
                      <td className="px-4 py-3 text-gray-400">28ft Cargo Trailer</td>
                      <td className="px-4 py-3">1,800 cu ft</td>
                      <td className="px-4 py-3 text-green-400 font-semibold">In Service</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
           * SUBVIEW: ORDER REQUEST FORM (order.html)
           * ========================================================================= */}
          {(currentSubView === 'order_fleet' || currentSubView === 'order_office') && (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station {currentStationNumber} -{' '}
                {currentSubView === 'order_fleet' ? 'Fleet Supply Order' : 'Office Supply Order'}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Order request submitted for station review.');
                  setCurrentSubView('report');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydraulic oil, strap replacements, printer paper..."
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    defaultValue="1"
                    min="1"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Reason / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Reason for order request..."
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm cursor-pointer"
                  >
                    Submit Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSubView('report')}
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
           * SUBVIEW: SERVICE LOG (vehicle_inspection.html)
           * ========================================================================= */}
          {(currentSubView === 'service_truck' || currentSubView === 'service_trailer') && (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station {currentStationNumber} -{' '}
                {currentSubView === 'service_truck' ? 'Truck Service Log' : 'Trailer Service Log'}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Active service tickets and routine maintenance logs for Station {currentStationNumber}.
              </p>
              <div className="space-y-3">
                {(currentSubView === 'service_truck'
                  ? mockTruckInspections
                  : mockTrailerInspections
                ).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg flex items-start justify-between"
                  >
                    <div>
                      <h4 className="text-white font-bold">{item.vehicle}</h4>
                      <p className="text-sm text-red-400">{item.type}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{item.date}</span>
                      <p className="text-xs text-gray-300 mt-1">Tech: {item.technician}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StationReportPage;
