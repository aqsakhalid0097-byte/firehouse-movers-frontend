'use client';

import React, { useState } from 'react';
import {
  Truck,
  Car,
  Users,
  ClipboardList,
  BarChart3,
  FileText,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  useLogisticsVehicles,
  useCreateLogisticsVehicle,
  useLogisticsCrews,
  useCreateLogisticsCrew,
  useVehicleAvailability,
  useUpdateVehicleAvailability,
  useAvailabilityReport,
  useLogisticsReport,
  useLogisticsDashboard,
  useCreateLogisticsOrder,
  useCreateLogisticsDispatch,
} from '../api/operationalApi';

type ActiveView =
  | 'availability'
  | 'vehicle_list'
  | 'vehicle_add'
  | 'crew_list'
  | 'crew_add'
  | 'job_logistics'
  | 'availability_report'
  | 'logistic_report';

export const VehicleAvailabilityPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('availability');

  // Truck & Trailer availability state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-filter tabs
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'truck' | 'trailer'>('truck');
  const [crewRoleFilter, setCrewRoleFilter] = useState<'leader' | 'member'>('leader');
  const [reportType, setReportType] = useState<
    'daily_job_summary' | 'crew_performance' | 'vehicle_utilization' | 'referral_effectiveness'
  >('daily_job_summary');
  const [reportFilterTab, setReportFilterTab] = useState<'trucks' | 'trailers'>('trucks');

  // Availability report state
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');

  // Add Vehicle Form state
  const [newVehName, setNewVehName] = useState('');
  const [newVehType, setNewVehType] = useState<'truck' | 'trailer'>('truck');
  const [newVehNumber, setNewVehNumber] = useState('');
  const [newVehVin, setNewVehVin] = useState('');
  const [newVehStation, setNewVehStation] = useState('Station 1 - Dallas HQ');
  const [newVehCapacity, setNewVehCapacity] = useState('1500');
  const [newVehLength, setNewVehLength] = useState('24');

  // Add Crew Form state
  const [newCrewUserId, setNewCrewUserId] = useState<number | string>('');
  const [newCrewRole, setNewCrewRole] = useState<'leader' | 'member'>('leader');

  // Local availability edits buffer
  const [localAvailability, setLocalAvailability] = useState<Record<number, { status: string; estimated_date: string }>>({});

  // Job Logistics Form state
  const [orderFormDate, setOrderFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderFormJobNo, setOrderFormJobNo] = useState(`JOB-${Math.floor(9400 + Math.random() * 100)}`);
  const [orderFormCustomer, setOrderFormCustomer] = useState('');
  const [orderFormPhone, setOrderFormPhone] = useState('');
  const [orderFormMoveType, setOrderFormMoveType] = useState('moving');
  const [orderFormMovedBefore, setOrderFormMovedBefore] = useState(false);
  const [orderFormReferral, setOrderFormReferral] = useState('google');
  const [orderFormCrewName, setOrderFormCrewName] = useState<number | string>('');
  const [orderFormCrewAvailable, setOrderFormCrewAvailable] = useState(true);
  const [orderFormTrucksCount, setOrderFormTrucksCount] = useState(2);
  const [orderFormTrailersCount, setOrderFormTrailersCount] = useState(1);
  const [orderFormNotes, setOrderFormNotes] = useState('');

  // Dispatch details state
  const [dispatchIpad, setDispatchIpad] = useState('iPad 1');
  const [dispatchCrewLeads, setDispatchCrewLeads] = useState<number | string>('');
  const [dispatchMaterial, setDispatchMaterial] = useState('Loaded in Trailer');
  const [dispatchSpecialEquip, setDispatchSpecialEquip] = useState('No');
  const [dispatchSpecialStatus, setDispatchSpecialStatus] = useState('');
  const [dispatchSpeedyAcct, setDispatchSpeedyAcct] = useState('FH-RES-1052');
  const [dispatchNotes, setDispatchNotes] = useState('');

  // Selected order in right side
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Queries
  const { data: availabilityData, isLoading: isAvailabilityLoading } = useVehicleAvailability(selectedDate);
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useLogisticsVehicles({ type: vehicleTypeFilter });
  const { data: crewsData, isLoading: isCrewsLoading } = useLogisticsCrews({ role: crewRoleFilter });
  const { data: logisticsDashboardData } = useLogisticsDashboard();
  const { data: availabilityReportData, isLoading: isAvailabilityReportLoading } = useAvailabilityReport({ start_date: startDate, end_date: endDate });
  const { data: logisticsReportData } = useLogisticsReport({ start_date: startDate, end_date: endDate, report_type: reportType });

  // Mutations
  const createVehicleMutation = useCreateLogisticsVehicle();
  const createCrewMutation = useCreateLogisticsCrew();
  const updateAvailabilityMutation = useUpdateVehicleAvailability();
  const createOrderMutation = useCreateLogisticsOrder();
  const createDispatchMutation = useCreateLogisticsDispatch();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit Availability Handler
  const handleSubmitAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = Object.entries(localAvailability).map(([vehId, data]) => ({
      vehicle_id: Number(vehId),
      status: data.status,
      estimated_back_in_service_date: data.estimated_date || null,
    }));

    if (updates.length === 0) {
      showToast('No availability changes to save.');
      return;
    }

    try {
      await updateAvailabilityMutation.mutateAsync({
        date: selectedDate,
        updates,
      });
      showToast(`Vehicle availability for ${selectedDate} updated successfully!`);
      setLocalAvailability({});
    } catch (err: any) {
      alert(err.message || 'Failed to update vehicle availability');
    }
  };

  // Add Vehicle Handler
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehNumber.trim()) {
      alert('Vehicle number is required');
      return;
    }
    try {
      await createVehicleMutation.mutateAsync({
        name: newVehName.trim() || undefined,
        vehicle_type: newVehType,
        number: newVehNumber.trim(),
        last_inspection_date: new Date().toISOString().split('T')[0],
      });
      showToast(`Vehicle ${newVehNumber} added successfully to backend database!`);
      setNewVehName('');
      setNewVehNumber('');
      setNewVehVin('');
      setActiveView('vehicle_list');
      setVehicleTypeFilter(newVehType);
    } catch (err: any) {
      alert(err.message || 'Failed to add vehicle');
    }
  };

  // Add Crew Handler
  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUserId = newCrewUserId || crewsData?.available_employees?.[0]?.id;
    if (!targetUserId) {
      alert('Please select an employee profile for the crew member');
      return;
    }
    try {
      await createCrewMutation.mutateAsync({
        user: Number(targetUserId),
        role: newCrewRole,
      });
      showToast(`Crew member added successfully!`);
      setNewCrewUserId('');
      setActiveView('crew_list');
      setCrewRoleFilter(newCrewRole);
    } catch (err: any) {
      alert(err.message || 'Failed to add crew member');
    }
  };

  // Select Order from right panel into form
  const handleSelectOrder = (order: any) => {
    setSelectedOrderId(order.id);
    setOrderFormDate(order.date || new Date().toISOString().split('T')[0]);
    setOrderFormJobNo(order.job_no || '');
    setOrderFormCustomer(order.last_name_customer || '');
    setOrderFormPhone(order.phone_number || '');
    setOrderFormMoveType(order.type_of_move || 'moving');
    setOrderFormMovedBefore(!!order.moved_before);
    setOrderFormReferral(order.referral_source || 'google');
    setOrderFormCrewName(order.crew_name_id || '');
    setOrderFormCrewAvailable(!!order.crew_available);
    setOrderFormTrucksCount(order.number_of_trucks || 1);
    setOrderFormTrailersCount(order.number_of_trailers || 0);
    setOrderFormNotes(order.notes_order_detail || '');
    showToast(`Loaded Job #${order.job_no} into logistics form`);
  };

  // Clear / Unselect Order
  const handleClearOrder = () => {
    setSelectedOrderId(null);
    setOrderFormDate(new Date().toISOString().split('T')[0]);
    setOrderFormJobNo(`JOB-${Math.floor(9400 + Math.random() * 100)}`);
    setOrderFormCustomer('');
    setOrderFormPhone('');
    setOrderFormMoveType('moving');
    setOrderFormMovedBefore(false);
    setOrderFormReferral('google');
    setOrderFormCrewName('');
    setOrderFormCrewAvailable(true);
    setOrderFormTrucksCount(2);
    setOrderFormTrailersCount(1);
    setOrderFormNotes('');
  };

  // Save Order Details
  const handleSaveOrderDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFormJobNo || !orderFormCustomer || !orderFormPhone) {
      alert('Please fill in Job Number, Customer Name, and Phone Number');
      return;
    }
    const defaultCrewId = crewsData?.results?.[0]?.id || 1;
    try {
      await createOrderMutation.mutateAsync({
        date: orderFormDate,
        job_no: orderFormJobNo,
        last_name_customer: orderFormCustomer,
        phone_number: orderFormPhone,
        type_of_move: orderFormMoveType,
        moved_before: orderFormMovedBefore,
        referral_source: orderFormReferral,
        crew_name: Number(orderFormCrewName) || defaultCrewId,
        crew_available: orderFormCrewAvailable,
        number_of_trucks: orderFormTrucksCount,
        number_of_trailers: orderFormTrailersCount,
        notes_order_detail: orderFormNotes || undefined,
      });
      showToast(`Order #${orderFormJobNo} saved successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to save order details');
    }
  };

  // Save Dispatch Details
  const handleSaveDispatchDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) {
      alert('Please select a pending order from the right panel to dispatch');
      return;
    }
    const defaultLeadId = crewsData?.results?.[0]?.id || 1;
    try {
      await createDispatchMutation.mutateAsync({
        order_id: selectedOrderId,
        ipad: dispatchIpad,
        crew_leads: Number(dispatchCrewLeads) || defaultLeadId,
        material: dispatchMaterial,
        special_equipment_needed: dispatchSpecialEquip,
        special_equipment_status: dispatchSpecialStatus || null,
        speedy_inventory_account: dispatchSpeedyAcct,
        notes_dispatcher: dispatchNotes || undefined,
      });
      showToast(`Dispatch created for Job #${orderFormJobNo}!`);
      handleClearOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to create dispatch');
    }
  };

  const pendingOrders = logisticsDashboardData?.pending_orders || [];
  const completedDispatches = logisticsDashboardData?.completed_dispatches || [];

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

      {/* Main Layout with Left Sidebar matching availability_logistic_base.html */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside
          className="w-64 flex-shrink-0 bg-[#1a1a1a] text-white px-6 py-8 hidden md:block print:hidden"
          data-tour-sidebar
        >
          <nav className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('availability')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'availability' ? 'bg-red-500 font-semibold' : ''
              }`}
            >
              <Truck className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Truck & Trailer Availability</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('vehicle_list')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'vehicle_list' || activeView === 'vehicle_add'
                  ? 'bg-red-500 font-semibold'
                  : ''
              }`}
            >
              <Car className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Add Vehicles</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('crew_list')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'crew_list' || activeView === 'crew_add'
                  ? 'bg-red-500 font-semibold'
                  : ''
              }`}
            >
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Add Crew</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('job_logistics')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'job_logistics' ? 'bg-red-500 font-semibold' : ''
              }`}
            >
              <ClipboardList className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Job Logistics Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('availability_report')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'availability_report' ? 'bg-red-500 font-semibold' : ''
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Availability Report</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('logistic_report')}
              className={`w-full text-left block py-2 px-3 rounded hover:bg-red-500 transition-all duration-200 cursor-pointer flex items-center ${
                activeView === 'logistic_report' ? 'bg-red-500 font-semibold' : ''
              }`}
            >
              <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Job Logistics Report</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-black text-white p-4 md:p-6 overflow-y-auto min-w-0" data-tour-main>
          {/* =========================================================================
           * VIEW 1: TRUCK & TRAILER AVAILABILITY (truck_availability.html)
           * ========================================================================= */}
          {activeView === 'availability' && (
            <div className="container mx-auto p-2">
              <h2 className="animate-heading text-3xl font-bold mb-6 text-left text-red-500">
                Truck & Trailer Availability
              </h2>

              <form onSubmit={handleSubmitAvailability} className="space-y-6">
                {/* Date Picker Section */}
                <div className="flex flex-col lg:flex-row items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="w-full lg:w-1/3">
                    <label htmlFor="id_date" className="block text-white font-medium mb-1 text-sm">
                      Select Date:
                    </label>
                    <input
                      type="date"
                      id="id_date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={updateAvailabilityMutation.isPending}
                      className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white py-2 px-4 shadow rounded cursor-pointer font-medium text-sm disabled:opacity-50"
                    >
                      {updateAvailabilityMutation.isPending ? 'Updating...' : 'Submit Availability'}
                    </button>
                  </div>
                </div>

                {/* Availability Sections */}
                {isAvailabilityLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Truck Availability Section */}
                    <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow p-4 space-y-6 max-h-[600px] overflow-y-auto">
                      <h3 className="text-xl font-semibold text-white">Truck Availability</h3>
                      <div className="space-y-4">
                        {(availabilityData?.trucks || []).map((truck) => {
                          const currentStatus =
                            localAvailability[truck.id]?.status ??
                            truck.availability?.status ??
                            'In Service';
                          const currentEstDate =
                            localAvailability[truck.id]?.estimated_date ??
                            truck.availability?.estimated_back_in_service_date ??
                            '';

                          return (
                            <div
                              key={truck.id}
                              className="space-y-4 bg-[#222222] p-4 rounded-lg border border-[#2b2b2b]"
                            >
                              <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start">
                                <p className="text-white font-semibold min-w-28">{truck.number}</p>
                                <select
                                  value={currentStatus}
                                  onChange={(e) => {
                                    setLocalAvailability((prev) => ({
                                      ...prev,
                                      [truck.id]: {
                                        status: e.target.value,
                                        estimated_date: currentEstDate,
                                      },
                                    }));
                                  }}
                                  className="h-10 bg-[#1a1a1a] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full lg:w-1/2 text-sm"
                                >
                                  <option value="In Service" className="bg-[#1a1a1a] text-white">
                                    In Service
                                  </option>
                                  <option value="Out of Service" className="bg-[#1a1a1a] text-white">
                                    Out of Service
                                  </option>
                                </select>
                                <div className="w-full lg:w-1/2">
                                  <input
                                    type="date"
                                    placeholder="Est. Return Date"
                                    value={currentEstDate}
                                    onChange={(e) => {
                                      setLocalAvailability((prev) => ({
                                        ...prev,
                                        [truck.id]: {
                                          status: currentStatus,
                                          estimated_date: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="h-10 bg-[#1a1a1a] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Trailer Availability Section */}
                    <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow p-4 space-y-6 max-h-[600px] overflow-y-auto">
                      <h3 className="text-xl font-semibold text-white">Trailer Availability</h3>
                      <div className="space-y-4">
                        {(availabilityData?.trailers || []).map((trailer) => {
                          const currentStatus =
                            localAvailability[trailer.id]?.status ??
                            trailer.availability?.status ??
                            'In Service';
                          const currentEstDate =
                            localAvailability[trailer.id]?.estimated_date ??
                            trailer.availability?.estimated_back_in_service_date ??
                            '';

                          return (
                            <div
                              key={trailer.id}
                              className="space-y-4 bg-[#222222] p-4 rounded-lg border border-[#2b2b2b]"
                            >
                              <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start">
                                <p className="text-white font-semibold min-w-28">{trailer.number}</p>
                                <select
                                  value={currentStatus}
                                  onChange={(e) => {
                                    setLocalAvailability((prev) => ({
                                      ...prev,
                                      [trailer.id]: {
                                        status: e.target.value,
                                        estimated_date: currentEstDate,
                                      },
                                    }));
                                  }}
                                  className="h-10 bg-[#1a1a1a] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full lg:w-1/2 text-sm"
                                >
                                  <option value="In Service" className="bg-[#1a1a1a] text-white">
                                    In Service
                                  </option>
                                  <option value="Out of Service" className="bg-[#1a1a1a] text-white">
                                    Out of Service
                                  </option>
                                </select>
                                <div className="w-full lg:w-1/2">
                                  <input
                                    type="date"
                                    placeholder="Est. Return Date"
                                    value={currentEstDate}
                                    onChange={(e) => {
                                      setLocalAvailability((prev) => ({
                                        ...prev,
                                        [trailer.id]: {
                                          status: currentStatus,
                                          estimated_date: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="h-10 bg-[#1a1a1a] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* =========================================================================
           * VIEW 2: VEHICLE LIST (vehicle_list.html)
           * ========================================================================= */}
          {activeView === 'vehicle_list' && (
            <div className="container mx-auto p-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="animate-heading text-3xl font-bold text-left text-red-500">Vehicles</h2>
                <button
                  type="button"
                  onClick={() => setActiveView('vehicle_add')}
                  className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors cursor-pointer text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              {/* Filter: Trucks / Trailers buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setVehicleTypeFilter('truck')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm ${
                    vehicleTypeFilter === 'truck'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#333333] text-white hover:bg-[#444444]'
                  }`}
                >
                  Trucks
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleTypeFilter('trailer')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm ${
                    vehicleTypeFilter === 'trailer'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#333333] text-white hover:bg-[#444444]'
                  }`}
                >
                  Trailers
                </button>
              </div>

              {/* List of vehicles for selected type */}
              <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {vehicleTypeFilter === 'truck' ? 'Trucks' : 'Trailers'}
                </h3>
                {isVehiclesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm mb-4">
                      Showing 1 to {vehiclesData?.results?.length || 0} of{' '}
                      {vehiclesData?.count || 0} results
                    </p>
                    {vehiclesData?.results && vehiclesData.results.length > 0 ? (
                      <ul className="space-y-2">
                        {vehiclesData.results.map((vehicle) => (
                          <li
                            key={vehicle.id}
                            className="flex items-center justify-between bg-[#222222] px-4 py-3 rounded-lg border border-[#2b2b2b]"
                          >
                            <div>
                              <span className="text-white font-medium">{vehicle.number}</span>
                              {vehicle.name && (
                                <span className="text-gray-400 text-sm ml-3">— {vehicle.name}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {(vehicle as any).station_name || 'All Stations'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-8 text-center text-gray-500 text-sm">
                        No {vehicleTypeFilter === 'truck' ? 'trucks' : 'trailers'} found in the database.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
           * VIEW 2b: ADD VEHICLE FORM (vehicle_form.html)
           * ========================================================================= */}
          {activeView === 'vehicle_add' && (
            <div className="container mx-auto p-2 max-w-2xl">
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setActiveView('vehicle_list')}
                  className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to vehicles
                </button>
              </div>
              <h2 className="animate-heading text-3xl font-bold mb-6 text-left text-red-500">Add Vehicle</h2>

              <form
                onSubmit={handleAddVehicle}
                className="space-y-4 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-6"
              >
                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Vehicle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. 26ft Freightliner M2"
                    value={newVehName}
                    onChange={(e) => setNewVehName(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-1 text-sm">Vehicle Type</label>
                    <select
                      value={newVehType}
                      onChange={(e) => setNewVehType(e.target.value as 'truck' | 'trailer')}
                      className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                    >
                      <option value="truck">Truck</option>
                      <option value="trailer">Trailer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-1 text-sm">Vehicle Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Truck 106"
                      value={newVehNumber}
                      onChange={(e) => setNewVehNumber(e.target.value)}
                      className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1 text-sm">
                    VIN (17 characters)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1FVACWDT8HH998877"
                    value={newVehVin}
                    onChange={(e) => setNewVehVin(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm font-mono"
                  />
                  <p className="text-gray-500 text-xs mt-1">Vehicle Identification Number for Ford Pro tracking</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Station Facility</label>
                  <select
                    value={newVehStation}
                    onChange={(e) => setNewVehStation(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                  >
                    <option value="Station 1 - Dallas HQ">Station 1 - Dallas HQ</option>
                    <option value="Station 2 - Fort Worth">Station 2 - Fort Worth</option>
                    <option value="Station 3 - Plano Hub">Station 3 - Plano Hub</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-1 text-sm">Capacity (cu ft)</label>
                    <input
                      type="number"
                      value={newVehCapacity}
                      onChange={(e) => setNewVehCapacity(e.target.value)}
                      className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-1 text-sm">Length (feet)</label>
                    <input
                      type="number"
                      value={newVehLength}
                      onChange={(e) => setNewVehLength(e.target.value)}
                      className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createVehicleMutation.isPending}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors cursor-pointer text-sm disabled:opacity-50"
                  >
                    {createVehicleMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('vehicle_list')}
                    className="px-5 py-2.5 bg-[#333333] hover:bg-[#444444] text-white font-medium rounded-md transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
           * VIEW 3: CREW LIST (crew_list.html)
           * ========================================================================= */}
          {activeView === 'crew_list' && (
            <div className="container mx-auto p-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="animate-heading text-3xl font-bold text-left text-red-500">Crew</h2>
                <button
                  type="button"
                  onClick={() => {
                    setNewCrewRole(crewRoleFilter);
                    setActiveView('crew_add');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors cursor-pointer text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Add {crewRoleFilter === 'leader' ? 'Leader' : 'Member'}</span>
                </button>
              </div>

              {/* Filter: Leaders / Members buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setCrewRoleFilter('leader')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm ${
                    crewRoleFilter === 'leader'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#333333] text-white hover:bg-[#444444]'
                  }`}
                >
                  Leaders
                </button>
                <button
                  type="button"
                  onClick={() => setCrewRoleFilter('member')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm ${
                    crewRoleFilter === 'member'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#333333] text-white hover:bg-[#444444]'
                  }`}
                >
                  Members
                </button>
              </div>

              {/* List of individuals for selected role */}
              <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {crewRoleFilter === 'leader' ? 'Leaders' : 'Members'}
                </h3>
                {isCrewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm mb-4">
                      Showing 1 to {crewsData?.results?.length || 0} of{' '}
                      {crewsData?.count || 0} results
                    </p>
                    {crewsData?.results && crewsData.results.length > 0 ? (
                      <ul className="space-y-2">
                        {crewsData.results.map((person) => {
                          const userName = person.user?.full_name || (person as any).name || 'Crew Member';
                          const userRole = person.role === 'leader' ? 'Crew Leader' : 'Crew Member';
                          return (
                            <li
                              key={person.id}
                              className="flex items-center justify-between bg-[#222222] px-4 py-3 rounded-lg border border-[#2b2b2b]"
                            >
                              <span className="text-white font-medium">{userName}</span>
                              <span className="text-gray-400 text-sm">{userRole}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="py-8 text-center text-gray-500 text-sm">
                        No {crewRoleFilter === 'leader' ? 'leaders' : 'members'} found in the database.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
           * VIEW 3b: ADD CREW FORM (crew_form.html)
           * ========================================================================= */}
          {activeView === 'crew_add' && (
            <div className="container mx-auto p-2 max-w-2xl">
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setActiveView('crew_list')}
                  className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to crew
                </button>
              </div>
              <h2 className="animate-heading text-3xl font-bold mb-6 text-left text-red-500">
                Add {newCrewRole === 'leader' ? 'Leader' : 'Member'}
              </h2>

              <form
                onSubmit={handleAddCrew}
                className="space-y-4 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-6"
              >
                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Select Employee</label>
                  <select
                    required
                    value={newCrewUserId}
                    onChange={(e) => setNewCrewUserId(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                  >
                    <option value="">Select an Employee...</option>
                    {crewsData?.available_employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.job_title || 'Staff'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Role</label>
                  <select
                    value={newCrewRole}
                    onChange={(e) => setNewCrewRole(e.target.value as 'leader' | 'member')}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-sm"
                  >
                    <option value="leader">Leader</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createCrewMutation.isPending}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors cursor-pointer text-sm disabled:opacity-50"
                  >
                    {createCrewMutation.isPending ? 'Adding...' : `Add ${newCrewRole === 'leader' ? 'Leader' : 'Member'}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('crew_list')}
                    className="px-5 py-2.5 bg-[#333333] hover:bg-[#444444] text-white font-medium rounded-md transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
           * VIEW 4: JOB LOGISTICS (job_logistics.html)
           * ========================================================================= */}
          {activeView === 'job_logistics' && (
            <div className="container mx-auto p-2">
              <h2 className="animate-heading text-3xl font-bold mb-6 text-left text-red-500">Job Logistics</h2>

              <div className="grid grid-cols-12 gap-6">
                {/* Forms Section (9 cols left panel) */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                  {/* Form 1: Order Details Form */}
                  <form
                    onSubmit={handleSaveOrderDetails}
                    className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-red-500 text-left">Order Details</h2>
                      {selectedOrderId && (
                        <button
                          type="button"
                          onClick={handleClearOrder}
                          className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Date</label>
                        <input
                          type="date"
                          value={orderFormDate}
                          onChange={(e) => setOrderFormDate(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Job #</label>
                        <input
                          type="text"
                          required
                          value={orderFormJobNo}
                          onChange={(e) => setOrderFormJobNo(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Last Name Customer</label>
                        <input
                          type="text"
                          required
                          value={orderFormCustomer}
                          onChange={(e) => setOrderFormCustomer(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={orderFormPhone}
                          onChange={(e) => setOrderFormPhone(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Type of Move</label>
                        <select
                          value={orderFormMoveType}
                          onChange={(e) => setOrderFormMoveType(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="moving">Moving</option>
                          <option value="packing">Packing</option>
                          <option value="moving_packing">Moving & Packing</option>
                          <option value="load_only">Load Only</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-5">
                        <input
                          type="checkbox"
                          id="moved_before_cb"
                          checked={orderFormMovedBefore}
                          onChange={(e) => setOrderFormMovedBefore(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <label htmlFor="moved_before_cb" className="text-white text-xs font-medium cursor-pointer">
                          Moved with Firehouse before?
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Referral Source</label>
                        <select
                          value={orderFormReferral}
                          onChange={(e) => setOrderFormReferral(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="google">Google</option>
                          <option value="yelp">Yelp</option>
                          <option value="friend">Friend</option>
                          <option value="facebook">Facebook</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Crew Name</label>
                        <select
                          value={orderFormCrewName}
                          onChange={(e) => setOrderFormCrewName(e.target.value)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="">Select Crew...</option>
                          {crewsData?.results?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.user?.full_name || (c as any).name || `Crew #${c.id}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Number of Trucks</label>
                        <input
                          type="number"
                          min="0"
                          value={orderFormTrucksCount}
                          onChange={(e) => setOrderFormTrucksCount(parseInt(e.target.value, 10) || 0)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Number of Trailers</label>
                        <input
                          type="number"
                          min="0"
                          value={orderFormTrailersCount}
                          onChange={(e) => setOrderFormTrailersCount(parseInt(e.target.value, 10) || 0)}
                          className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium text-xs mb-1">Order Notes</label>
                      <textarea
                        rows={2}
                        value={orderFormNotes}
                        onChange={(e) => setOrderFormNotes(e.target.value)}
                        className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                      />
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="submit"
                        disabled={createOrderMutation.isPending}
                        className="px-6 py-2.5 text-white font-semibold bg-[#262626] hover:bg-red-600 transition-all duration-300 w-full rounded cursor-pointer text-sm disabled:opacity-50"
                      >
                        {createOrderMutation.isPending ? 'Saving...' : 'Save Order Details'}
                      </button>
                    </div>
                  </form>

                  {/* Form 2: Dispatch Details Form */}
                  <form
                    onSubmit={handleSaveDispatchDetails}
                    className="bg-[#222222] border border-[#2b2b2b] rounded-lg p-6 space-y-4"
                  >
                    <h2 className="text-xl font-bold text-red-500 text-left">Dispatch Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">iPad</label>
                        <select
                          value={dispatchIpad}
                          onChange={(e) => setDispatchIpad(e.target.value)}
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="iPad 1">iPad 1</option>
                          <option value="iPad 2">iPad 2</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Crew Leads</label>
                        <select
                          value={dispatchCrewLeads}
                          onChange={(e) => setDispatchCrewLeads(e.target.value)}
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="">Select Crew Lead...</option>
                          {crewsData?.results?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.user?.full_name || (c as any).name || `Lead #${c.id}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Material</label>
                        <select
                          value={dispatchMaterial}
                          onChange={(e) => setDispatchMaterial(e.target.value)}
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="Loaded in Trailer">Loaded in Trailer</option>
                          <option value="Pulled">Pulled</option>
                          <option value="Needed to Pull">Needed to Pull</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Special Equipment</label>
                        <select
                          value={dispatchSpecialEquip}
                          onChange={(e) => setDispatchSpecialEquip(e.target.value)}
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        >
                          <option value="No">No</option>
                          <option value="Dolly">Dolly</option>
                          <option value="Hydraulic Stair Climber Dolly">Hydraulic Stair Climber Dolly</option>
                          <option value="Snap Lock Dollies">Snap Lock Dollies</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Special Status</label>
                        <input
                          type="text"
                          value={dispatchSpecialStatus}
                          onChange={(e) => setDispatchSpecialStatus(e.target.value)}
                          placeholder="Staged / Confirmed"
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium text-xs mb-1">Speedy Account</label>
                        <input
                          type="text"
                          value={dispatchSpeedyAcct}
                          onChange={(e) => setDispatchSpeedyAcct(e.target.value)}
                          className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium text-xs mb-1">Note Dispatcher</label>
                      <textarea
                        rows={2}
                        value={dispatchNotes}
                        onChange={(e) => setDispatchNotes(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none w-full text-xs"
                      />
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="submit"
                        disabled={createDispatchMutation.isPending || !selectedOrderId}
                        className="px-6 py-2.5 text-white font-semibold bg-[#262626] hover:bg-red-600 transition-all duration-300 w-full rounded cursor-pointer text-sm disabled:opacity-50"
                      >
                        {createDispatchMutation.isPending ? 'Saving...' : 'Save Dispatch Details'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Orders Section (3 cols right panel) */}
                <div className="col-span-12 lg:col-span-3 text-white space-y-6">
                  {/* Pending Orders Box */}
                  <div>
                    <h2 className="font-semibold text-lg text-red-500 text-left mb-2">
                      Pending Orders ({pendingOrders.length})
                    </h2>
                    <div className="border border-[#2b2b2b] bg-[#222222] rounded-md p-4 h-64 overflow-y-auto space-y-2">
                      {pendingOrders.map((order: any) => (
                        <div
                          key={order.id}
                          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            selectedOrderId === order.id ? 'bg-red-500/20 border border-red-500' : 'hover:bg-[#1a1a1a]'
                          }`}
                          onClick={() => handleSelectOrder(order)}
                        >
                          <input
                            type="radio"
                            name="selected_order_radio"
                            checked={selectedOrderId === order.id}
                            onChange={() => handleSelectOrder(order)}
                            className="mr-2 text-red-600 focus:ring-red-500"
                          />
                          <label className="text-xs font-medium text-white cursor-pointer">
                            {order.job_no} ({order.last_name_customer})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Dispatches Box */}
                  <div>
                    <h2 className="font-semibold text-lg text-red-500 text-left mb-2">
                      Completed Dispatches ({completedDispatches.length})
                    </h2>
                    <div className="border border-[#2b2b2b] bg-[#222222] rounded-md p-4 h-64 overflow-y-auto space-y-2">
                      {completedDispatches.map((disp: any) => (
                        <div
                          key={disp.id}
                          className="flex items-center p-2 rounded bg-[#1a1a1a]"
                        >
                          <span className="text-xs text-gray-300">
                            {disp.order_detail?.job_no || `Order #${disp.order}`} — {disp.ipad || 'iPad'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
           * VIEW 5: AVAILABILITY REPORT (availability_report.html)
           * ========================================================================= */}
          {activeView === 'availability_report' && (
            <div className="container mx-auto p-4 md:p-6 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow-md">
              <h2 className="animate-heading text-3xl font-bold mb-6 text-left text-red-500">Availability Report</h2>

              {/* Date Filters Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label htmlFor="rep_start_date" className="block font-medium text-white text-sm mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="rep_start_date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="rep_end_date" className="block font-medium text-white text-sm mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="rep_end_date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setReportFilterTab('trucks')}
                  className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 cursor-pointer text-sm ${
                    reportFilterTab === 'trucks'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Trucks
                </button>
                <button
                  type="button"
                  onClick={() => setReportFilterTab('trailers')}
                  className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 cursor-pointer text-sm ${
                    reportFilterTab === 'trailers'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Trailers
                </button>
              </div>

              {/* Report Tables */}
              {isAvailabilityReportLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <div>
                  {reportFilterTab === 'trucks' && (
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-white mb-4">Trucks</h3>
                      <div className="max-h-96 overflow-y-auto border border-[#2b2b2b] rounded-lg">
                        <table className="table-auto w-full border-collapse">
                          <thead className="bg-[#262626] text-white">
                            <tr>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">Truck</th>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">In-Service Days</th>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">Out-of-Service Days</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(availabilityReportData?.trucks || []).map((truck, idx) => (
                              <tr
                                key={truck.id}
                                className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}
                              >
                                <td className="border border-[#2b2b2b] p-3 text-white text-sm">
                                  {truck.number} {truck.name ? `(${truck.name})` : ''}
                                </td>
                                <td className="border border-[#2b2b2b] p-3 text-green-400 font-semibold text-sm">
                                  {truck.in_service_days}
                                </td>
                                <td className="border border-[#2b2b2b] p-3 text-red-400 font-semibold text-sm">
                                  {truck.out_of_service_days}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {reportFilterTab === 'trailers' && (
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-white mb-4">Trailers</h3>
                      <div className="max-h-96 overflow-y-auto border border-[#2b2b2b] rounded-lg">
                        <table className="table-auto w-full border-collapse">
                          <thead className="bg-[#262626] text-white">
                            <tr>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">Trailer</th>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">In-Service Days</th>
                              <th className="border border-[#2b2b2b] p-3 text-left text-sm">Out-of-Service Days</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(availabilityReportData?.trailers || []).map((trailer, idx) => (
                              <tr
                                key={trailer.id}
                                className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}
                              >
                                <td className="border border-[#2b2b2b] p-3 text-white text-sm">
                                  {trailer.number} {trailer.name ? `(${trailer.name})` : ''}
                                </td>
                                <td className="border border-[#2b2b2b] p-3 text-green-400 font-semibold text-sm">
                                  {trailer.in_service_days}
                                </td>
                                <td className="border border-[#2b2b2b] p-3 text-red-400 font-semibold text-sm">
                                  {trailer.out_of_service_days}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 6: LOGISTIC REPORT (report.html)
           * ========================================================================= */}
          {activeView === 'logistic_report' && (
            <div className="container mx-auto p-4 md:p-6 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow-md space-y-6">
              <h2 className="animate-heading text-3xl font-bold text-red-500">Logistics Report</h2>

              {/* Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-xs font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded px-3 py-2 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#222222] border border-[#333333] text-white rounded px-3 py-2 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="bg-[#222222] border border-[#333333] text-white rounded px-3 py-2 text-xs w-full"
                  >
                    <option value="daily_job_summary">Daily Job Summary</option>
                    <option value="crew_performance">Crew Performance</option>
                    <option value="vehicle_utilization">Vehicle Utilization</option>
                    <option value="referral_effectiveness">Referral Effectiveness</option>
                  </select>
                </div>
              </div>

              {/* Report Tables */}
              <div className="max-h-[500px] overflow-y-auto border border-[#2b2b2b] rounded-lg">
                <table className="table-auto w-full border-collapse">
                  <thead className="bg-[#262626] text-white">
                    <tr>
                      <th className="border border-[#2b2b2b] p-3 text-left text-sm">Item / Metric</th>
                      <th className="border border-[#2b2b2b] p-3 text-left text-sm">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(logisticsReportData?.job_summary || []).length > 0 ? (
                      (logisticsReportData?.job_summary || []).map((row: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}>
                          <td className="border border-[#2b2b2b] p-3 text-white text-sm">
                            {row.job_no || row.name || `Record #${idx + 1}`}
                          </td>
                          <td className="border border-[#2b2b2b] p-3 text-gray-300 text-sm">
                            {row.last_name_customer || row.status || JSON.stringify(row)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-gray-500 text-sm">
                          No logistics report records for the selected period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VehicleAvailabilityPage;
