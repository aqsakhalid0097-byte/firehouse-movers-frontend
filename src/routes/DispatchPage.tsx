'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Truck,
  Users,
  Clock,
  Shield,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Smartphone,
  Layers,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import {
  useLogisticsDashboard,
  useCreateLogisticsOrder,
  useCreateLogisticsDispatch,
} from '../api/operationalApi';
import type {
  LogisticsPendingOrder,
  LogisticsCompletedDispatch,
  LogisticsOrderWriteRequest,
  LogisticsDispatchWriteRequest,
} from '../api/types';

export const DispatchPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [dispatchOrderTarget, setDispatchOrderTarget] = useState<LogisticsPendingOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Queries & Mutations
  const { data: dashboardData, isLoading, isError, refetch } = useLogisticsDashboard();
  const createOrderMutation = useCreateLogisticsOrder();
  const createDispatchMutation = useCreateLogisticsDispatch();

  // Create Order Form State
  const [orderForm, setOrderForm] = useState<LogisticsOrderWriteRequest>({
    date: new Date().toISOString().split('T')[0],
    job_no: '',
    last_name_customer: '',
    phone_number: '',
    type_of_move: 'moving',
    moved_before: false,
    crew_name: 1,
    referral_source: 'google',
    crew_available: true,
    number_of_trucks: 1,
    number_of_trailers: 1,
    notes_order_detail: '',
  });

  // Dispatch Form State
  const [dispatchForm, setDispatchForm] = useState<LogisticsDispatchWriteRequest>({
    order_id: 0,
    ipad: 'iPad 1',
    crew_leads: 1,
    material: 'Not Required',
    special_equipment_needed: 'No',
    notes_dispatcher: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingOrders: LogisticsPendingOrder[] = dashboardData?.pending_orders || [];
  const completedDispatches: LogisticsCompletedDispatch[] = dashboardData?.completed_dispatches || [];

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.job_no || !orderForm.last_name_customer || !orderForm.phone_number) {
      alert('Please fill in all required order fields.');
      return;
    }
    try {
      await createOrderMutation.mutateAsync(orderForm);
      showToast(`Job Order ${orderForm.job_no} created successfully!`);
      setShowCreateOrderModal(false);
      setOrderForm({
        date: new Date().toISOString().split('T')[0],
        job_no: '',
        last_name_customer: '',
        phone_number: '',
        type_of_move: 'moving',
        moved_before: false,
        crew_name: 1,
        referral_source: 'google',
        crew_available: true,
        number_of_trucks: 1,
        number_of_trailers: 1,
        notes_order_detail: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to create job order');
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchOrderTarget) return;

    try {
      await createDispatchMutation.mutateAsync({
        ...dispatchForm,
        order_id: Number(dispatchOrderTarget.id || 0),
      });
      showToast(`Order #${dispatchOrderTarget.job_no || dispatchOrderTarget.id} dispatched successfully!`);
      setDispatchOrderTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to complete dispatch');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" /> Logistics & Dispatch Console
            </div>
            <h1 className="animate-heading text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Calendar className="w-7 h-7 text-red-500" />
              Live Move Logistics Board
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage live job orders, truck dispatches, and field allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateOrderModal(true)}
            >
              Create Job Order
            </Button>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-gray-400 font-medium">Total Orders & Dispatches</span>
            <p className="text-2xl font-bold text-white mt-2">
              {pendingOrders.length + completedDispatches.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Recorded operations</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-rose-400 font-medium">Pending Orders</span>
            <p className="text-2xl font-bold text-rose-400 mt-2">{pendingOrders.length}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Awaiting dispatch assignment</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-emerald-400 font-medium">Completed Dispatches</span>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{completedDispatches.length}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Dispatched to field</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-sky-400 font-medium">Active Status</span>
            <p className="text-2xl font-bold text-sky-400 mt-2">Live</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Connected to backend</p>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-gray-400 font-medium">View Filter:</span>
          {(['all', 'pending', 'completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-950 text-gray-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Operations' : st === 'pending' ? 'Pending Orders' : 'Dispatched'}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-gray-400 text-sm">Loading live dispatch & logistics data...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-red-300 font-semibold text-sm">Failed to load logistics dashboard</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dispatches & Orders Roster */}
        {!isLoading && !isError && (
          <div className="space-y-8">
            {/* Section 1: Pending Orders */}
            {(statusFilter === 'all' || statusFilter === 'pending') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Pending Job Orders ({pendingOrders.length})
                  </h2>
                </div>

                {pendingOrders.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-gray-400">
                    <p className="text-sm">No pending job orders found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingOrders.map((order, idx) => (
                      <Card key={order.id || idx} className="p-6 bg-slate-900/60 border-slate-800 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">
                                {order.last_name_customer ? `Customer: ${order.last_name_customer}` : 'Pending Move'}
                              </span>
                              <Badge variant="warning">{order.type_of_move || 'Move'}</Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Job #{order.job_no || order.id || 'N/A'}</p>
                          </div>
                          <Badge variant="danger">Pending Dispatch</Badge>
                        </div>

                        <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-3.5 h-3.5 text-red-400" />
                            <span>Date: {order.date || 'Today'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Truck className="w-3.5 h-3.5 text-sky-400" />
                            <span>
                              Required Trucks: {order.number_of_trucks || 1} | Trailers: {order.number_of_trailers || 1}
                            </span>
                          </div>
                          {order.phone_number && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <span className="text-gray-400 font-medium">Phone:</span>
                              <span>{order.phone_number}</span>
                            </div>
                          )}
                          {order.notes_order_detail && (
                            <p className="text-gray-400 italic text-[11px] mt-1">"{order.notes_order_detail}"</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-gray-500">
                            Referral: {order.referral_source || 'Standard'}
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setDispatchOrderTarget(order);
                              setDispatchForm((prev) => ({
                                ...prev,
                                order_id: Number(order.id || 0),
                              }));
                            }}
                          >
                            Dispatch Order
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Completed Dispatches */}
            {(statusFilter === 'all' || statusFilter === 'completed') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Completed Dispatches ({completedDispatches.length})
                  </h2>
                </div>

                {completedDispatches.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-gray-400">
                    <p className="text-sm">No completed dispatches found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedDispatches.map((dispatch, idx) => (
                      <Card key={dispatch.id || idx} className="p-6 bg-slate-900/60 border-slate-800 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">
                                Dispatch #{dispatch.id || idx + 1}
                              </span>
                              <Badge variant="purple">{dispatch.ipad || 'iPad Console'}</Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Order Ref #{dispatch.order_id || 'N/A'}</p>
                          </div>
                          <Badge variant="success">Dispatched</Badge>
                        </div>

                        <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            <span>Crew Lead ID: {dispatch.crew_leads || 'Assigned'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Layers className="w-3.5 h-3.5 text-sky-400" />
                            <span>Material Status: {dispatch.material || 'Standard'}</span>
                          </div>
                          {dispatch.special_equipment_needed && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Truck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Equipment: {dispatch.special_equipment_needed}</span>
                            </div>
                          )}
                          {dispatch.notes_dispatcher && (
                            <p className="text-gray-400 italic text-[11px] mt-1">"{dispatch.notes_dispatcher}"</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal: Create Job Order */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Create Job Order
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateOrderModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={orderForm.date}
                    onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Job Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JOB-1049"
                    value={orderForm.job_no}
                    onChange={(e) => setOrderForm({ ...orderForm, job_no: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={orderForm.last_name_customer}
                    onChange={(e) => setOrderForm({ ...orderForm, last_name_customer: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (214) 555-0192"
                    value={orderForm.phone_number}
                    onChange={(e) => setOrderForm({ ...orderForm, phone_number: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Type of Move</label>
                  <select
                    value={orderForm.type_of_move}
                    onChange={(e) => setOrderForm({ ...orderForm, type_of_move: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="moving">Moving</option>
                    <option value="packing">Packing</option>
                    <option value="moving_packing">Moving & Packing</option>
                    <option value="commercial">Commercial</option>
                    <option value="load_only">Load Only</option>
                    <option value="unload_only">Unload Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Referral Source</label>
                  <select
                    value={orderForm.referral_source}
                    onChange={(e) => setOrderForm({ ...orderForm, referral_source: e.target.value })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="google">Google</option>
                    <option value="yelp">Yelp</option>
                    <option value="friend">Friend / Referral</option>
                    <option value="facebook">Facebook</option>
                    <option value="moved_before">Moved Before</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Number of Trucks</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={orderForm.number_of_trucks}
                    onChange={(e) => setOrderForm({ ...orderForm, number_of_trucks: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Number of Trailers</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={orderForm.number_of_trailers}
                    onChange={(e) => setOrderForm({ ...orderForm, number_of_trailers: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Order Notes</label>
                <textarea
                  rows={3}
                  placeholder="Specific client instructions, elevator access, parking permits..."
                  value={orderForm.notes_order_detail}
                  onChange={(e) => setOrderForm({ ...orderForm, notes_order_detail: e.target.value })}
                  className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? 'Creating Order...' : 'Submit Job Order'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateOrderModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Pending Order */}
      {dispatchOrderTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                Dispatch Order: #{dispatchOrderTarget.job_no || dispatchOrderTarget.id}
              </h3>
              <button
                type="button"
                onClick={() => setDispatchOrderTarget(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Assigned iPad</label>
                <select
                  value={dispatchForm.ipad}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, ipad: e.target.value })}
                  className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="iPad 1">iPad 1</option>
                  <option value="iPad 2">iPad 2</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Material Required</label>
                <select
                  value={dispatchForm.material}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, material: e.target.value })}
                  className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Not Required">Not Required</option>
                  <option value="Needed to Pull">Needed to Pull</option>
                  <option value="Pulled">Pulled</option>
                  <option value="Loaded in Trailer">Loaded in Trailer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Special Equipment</label>
                <select
                  value={dispatchForm.special_equipment_needed}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, special_equipment_needed: e.target.value })}
                  className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="No">No</option>
                  <option value="Dolly">Dolly</option>
                  <option value="Hydraulic Stair Climber Dolly">Hydraulic Stair Climber Dolly</option>
                  <option value="Piano Board And Moon Dog">Piano Board And Moon Dog</option>
                  <option value="Red Panel Cart">Red Panel Cart</option>
                  <option value="Snap Lock Dollies">Snap Lock Dollies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Dispatcher Notes</label>
                <textarea
                  rows={3}
                  placeholder="Driver staging notes, trailer hook instructions..."
                  value={dispatchForm.notes_dispatcher}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, notes_dispatcher: e.target.value })}
                  className="w-full bg-[#262626] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={createDispatchMutation.isPending}
                >
                  {createDispatchMutation.isPending ? 'Confirming...' : 'Confirm & Complete Dispatch'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDispatchOrderTarget(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchPage;
