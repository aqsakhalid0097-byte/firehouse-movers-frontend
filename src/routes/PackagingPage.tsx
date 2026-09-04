'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Box,
  RotateCcw,
  ShoppingCart,
  Receipt,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  AlertTriangle,
  FileSignature,
  Calendar,
  Layers,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  usePackagingDashboard,
  usePackagingPullFormOptions,
  usePullPackagingMaterial,
  usePackagingReturnFormOptions,
  useReturnPackagingMaterial,
  usePackagingOrderFormOptions,
  useOrderPackagingMaterial,
  usePackagingReceipts,
  useRecordPackagingReceipts,
} from '../api/operationalApi';
import type {
  PeopleDirectoryMember,
} from '../api/types';

type ActiveView =
  | 'dashboard'
  | 'pull_material'
  | 'return_material'
  | 'order_material'
  | 'record_receipt';

const MATERIAL_LABELS: Record<string, string> = {
  small_boxes: 'Small Boxes (1.5 cu ft)',
  medium_boxes: 'Medium Boxes (3.0 cu ft)',
  large_boxes: 'Large Boxes (4.5 cu ft)',
  xl_boxes: 'X-Large Boxes (6.0 cu ft)',
  wardrobe_boxes: 'Wardrobe Boxes w/ Bar',
  dish_boxes: 'Dish Pack Boxes',
  singleface_protection: 'Singleface Floor Protection',
  carpet_mask: 'Carpet Mask Rolls',
  paper_pads: 'Paper Pads',
  packing_paper: 'Packing Paper (25lb bundle)',
  tape: 'Rolls of Tape',
  wine_boxes: 'Wine Shipping Cartons',
  stretch_wrap: 'Stretch Wrap Rolls',
  tie_down_webbing: 'E-Track Tie Down Webbing',
  packing_peanuts: 'Bags of Packing Peanuts',
  ram_board: 'Ram Board Heavy Surface',
  mattress_bags: 'Mattress Protective Bags',
  mirror_cartons: 'Mirror / Picture Cartons',
  bubble_wrap: 'Bubble Wrap (100ft roll)',
  gondola_boxes: 'Commercial Gondola Boxes',
};

export const PackagingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  // Pull Form State
  const [pullJobId, setPullJobId] = useState('');
  const [pullTrailerNumber, setPullTrailerNumber] = useState<string>('101');
  const [pullEmployeeId, setPullEmployeeId] = useState<number | string>('');
  const [pullSignature, setPullSignature] = useState('');
  const [pullQuantities, setPullQuantities] = useState<Record<string, number>>({});

  // Return Form State
  const [returnJobId, setReturnJobId] = useState('');
  const [returnTrailerNumber, setReturnTrailerNumber] = useState<string>('101');
  const [returnEmployeeId, setReturnEmployeeId] = useState<number | string>('');
  const [returnSignature, setReturnSignature] = useState('');
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});

  // Order Form State
  const [orderPoNumber, setOrderPoNumber] = useState('');
  const [orderStation, setOrderStation] = useState<string>('Warehouse Main');
  const [orderEmployeeId, setOrderEmployeeId] = useState<number | string>('');
  const [orderSignature, setOrderSignature] = useState('');
  const [orderSupplierEmail, setOrderSupplierEmail] = useState('');
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

  // Receipt Form State
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptDetail, setReceiptDetail] = useState('');

  // Queries
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = usePackagingDashboard();

  const { data: pullFormOptions, isLoading: isPullOptionsLoading } = usePackagingPullFormOptions();
  const { data: returnFormOptions, isLoading: isReturnOptionsLoading } = usePackagingReturnFormOptions(
    returnJobId || undefined
  );
  const { data: orderFormOptions, isLoading: isOrderOptionsLoading } = usePackagingOrderFormOptions();
  const { data: receiptsData, isLoading: isReceiptsLoading } = usePackagingReceipts(
    receiptDate
  );

  // Mutations
  const pullMutation = usePullPackagingMaterial();
  const returnMutation = useReturnPackagingMaterial();
  const orderMutation = useOrderPackagingMaterial();
  const recordReceiptMutation = useRecordPackagingReceipts();

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const inventory: Record<string, number> = dashboardData?.inventory || {};
  const recentTransactions: any[] = dashboardData?.recent_transactions || [];
  const recentReceipts: any[] = dashboardData?.recent_receipts || [];

  const availableEmployees: PeopleDirectoryMember[] =
    pullFormOptions?.employees || returnFormOptions?.employees || orderFormOptions?.employees || [];

  // Handler: Pull Materials
  const handlePullSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pullJobId || !pullEmployeeId || !pullSignature) {
      alert('Please fill in Job Number, Employee, and Signature.');
      return;
    }
    const cleanQuantities = Object.fromEntries(
      Object.entries(pullQuantities).filter(([_, qty]) => Number(qty) > 0)
    );
    if (Object.keys(cleanQuantities).length === 0) {
      alert('Please specify at least one material quantity to pull.');
      return;
    }

    try {
      await pullMutation.mutateAsync({
        job_id: pullJobId,
        trailer_number: pullTrailerNumber,
        employee: Number(pullEmployeeId),
        employee_signature: pullSignature,
        quantities: cleanQuantities,
      });
      showToast(`Materials successfully pulled for Job ${pullJobId}!`);
      setPullQuantities({});
      setPullSignature('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to pull materials');
    }
  };

  // Handler: Return Materials
  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnJobId || !returnEmployeeId || !returnSignature) {
      alert('Please fill in Job Number, Employee, and Signature.');
      return;
    }
    const cleanQuantities = Object.fromEntries(
      Object.entries(returnQuantities).filter(([_, qty]) => Number(qty) > 0)
    );
    if (Object.keys(cleanQuantities).length === 0) {
      alert('Please specify at least one material quantity to return.');
      return;
    }

    try {
      await returnMutation.mutateAsync({
        job_id: returnJobId,
        trailer_number: returnTrailerNumber,
        employee: Number(returnEmployeeId),
        employee_signature: returnSignature,
        quantities: cleanQuantities,
      });
      showToast(`Materials returned for Job ${returnJobId}!`);
      setReturnQuantities({});
      setReturnSignature('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to return materials');
    }
  };

  // Handler: Order Materials
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderPoNumber || !orderEmployeeId || !orderSignature || !orderSupplierEmail) {
      alert('Please fill in PO Number, Employee, Supplier Email, and Signature.');
      return;
    }
    const cleanQuantities = Object.fromEntries(
      Object.entries(orderQuantities).filter(([_, qty]) => Number(qty) > 0)
    );
    if (Object.keys(cleanQuantities).length === 0) {
      alert('Please specify at least one material quantity to order.');
      return;
    }

    try {
      await orderMutation.mutateAsync({
        job_id: orderPoNumber,
        trailer_number: orderStation,
        employee: Number(orderEmployeeId),
        employee_signature: orderSignature,
        supplier_email: orderSupplierEmail,
        quantities: cleanQuantities,
      });
      showToast(`Purchase order sent to supplier for PO #${orderPoNumber}!`);
      setOrderQuantities({});
      setOrderSignature('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to submit material order');
    }
  };

  // Handler: Record Receipt
  const handleRecordReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptDetail.trim()) {
      alert('Please provide receipt / delivery confirmation notes.');
      return;
    }
    try {
      await recordReceiptMutation.mutateAsync({
        detail: receiptDetail.trim(),
      });
      showToast('Packaging material receipt logged successfully!');
      setReceiptDetail('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to record receipt');
    }
  };

  const allMaterialKeys = Object.keys(MATERIAL_LABELS);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#262626] via-[#1a1a1a] to-[#262626] text-gray-100 font-sans antialiased"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <header className="print:hidden">
        <Navbar isAuthenticated={true} user={user} onLogout={logout} />
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Sub-bar */}
      <div className="bg-[#262626] border-b border-gray-700 py-3 px-6 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-500" />
            <h1 className="animate-heading text-xl font-bold text-white tracking-tight">Packaging Materials Warehouse</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Inventory Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('pull_material')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'pull_material'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <Box className="w-4 h-4 text-emerald-400" />
              <span>Pull Materials</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('return_material')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'return_material'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Return Materials</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('order_material')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'order_material'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span>Order Materials</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('record_receipt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'record_receipt'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <Receipt className="w-4 h-4 text-purple-400" />
              <span>Record Receipts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* =========================================================================
         * VIEW 1: DASHBOARD
         * ========================================================================= */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Warehouse Material Stock</h2>
              <p className="text-sm text-gray-400 mt-1">Live tracking of box inventory, tape, wrap, and supplies.</p>
            </div>

            {isDashboardLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading packaging inventory levels...</p>
              </div>
            ) : isDashboardError ? (
              <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-6 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-red-300 font-semibold text-sm">Failed to load packaging dashboard</p>
                <button
                  type="button"
                  onClick={() => refetchDashboard()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Inventory Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allMaterialKeys.map((key) => {
                    const count = inventory[key] !== undefined ? inventory[key] : 0;
                    const isLow = count < 10;
                    return (
                      <div
                        key={key}
                        className={`bg-[#262626] border rounded-xl p-4 transition-all shadow-md ${
                          isLow ? 'border-amber-500/60 bg-amber-950/10' : 'border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-gray-300">
                            {MATERIAL_LABELS[key] || key}
                          </span>
                          {isLow && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low
                            </span>
                          )}
                        </div>
                        <p className={`text-3xl font-extrabold mt-3 ${isLow ? 'text-amber-400' : 'text-white'}`}>
                          {count}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">In Stock Warehouse</p>
                      </div>
                    );
                  })}
                </div>

                {/* Two Column Tables: Transactions & Receipts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Transactions */}
                  <div className="bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-lg space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Box className="w-5 h-5 text-emerald-400" />
                      Recent Material Dispatches & Pulls
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentTransactions.map((tx, idx) => (
                        <div
                          key={tx.id || idx}
                          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{tx.job_id || `Job #${idx + 1}`}</span>
                            <span className="text-gray-400">{tx.date || 'Recent'}</span>
                          </div>
                          <p className="text-gray-300">
                            Employee: {tx.employee || 'Crew'} | Trailer: {tx.trailer_number || '101'}
                          </p>
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {tx.transaction_type || 'Pull'}
                          </span>
                        </div>
                      ))}
                      {recentTransactions.length === 0 && (
                        <p className="text-gray-500 text-xs text-center py-6">No recent material transactions.</p>
                      )}
                    </div>
                  </div>

                  {/* Recent Receipts */}
                  <div className="bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-lg space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-purple-400" />
                      Recent Receipts & Deliveries
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentReceipts.map((rec, idx) => (
                        <div
                          key={rec.id || idx}
                          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Receipt #{rec.id || idx + 1}</span>
                            <span className="text-gray-400">{rec.date_received || rec.date || 'Recent'}</span>
                          </div>
                          <p className="text-gray-300">{rec.material || rec.notes || 'Warehouse shipment'}</p>
                          <p className="text-gray-500 text-[11px]">Logged by: {rec.uploaded_by || 'Staff'}</p>
                        </div>
                      ))}
                      {recentReceipts.length === 0 && (
                        <p className="text-gray-500 text-xs text-center py-6">No recent supplier receipts logged.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================================================
         * VIEW 2: PULL MATERIAL
         * ========================================================================= */}
        {activeView === 'pull_material' && (
          <div className="max-w-3xl mx-auto bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-emerald-400" />
                Pull Packaging Materials for Move
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {isPullOptionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading pull form options...</p>
              </div>
            ) : (
              <form onSubmit={handlePullSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Job Number / Ref</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JOB-9402"
                      value={pullJobId}
                      onChange={(e) => setPullJobId(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Trailer Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 104"
                      value={pullTrailerNumber}
                      onChange={(e) => setPullTrailerNumber(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Pulling Employee</label>
                    <select
                      required
                      value={pullEmployeeId}
                      onChange={(e) => setPullEmployeeId(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="">-- Choose Employee --</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantities Grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                    Specify Material Quantities to Pull
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-gray-700">
                    {allMaterialKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded hover:bg-[#262626]">
                        <span className="text-xs text-gray-300">{MATERIAL_LABELS[key]}</span>
                        <input
                          type="number"
                          min="0"
                          value={pullQuantities[key] || ''}
                          placeholder="0"
                          onChange={(e) =>
                            setPullQuantities({
                              ...pullQuantities,
                              [key]: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-20 bg-[#262626] border border-gray-600 rounded px-2 py-1 text-xs text-right text-white focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                    <FileSignature className="w-4 h-4 text-emerald-400" />
                    <span>Employee Digital Signature</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Type full legal name as digital signature (e.g. Carlos Rodriguez)"
                    value={pullSignature}
                    onChange={(e) => setPullSignature(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pullMutation.isPending}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Box className="w-5 h-5" />
                  <span>{pullMutation.isPending ? 'Processing Pull...' : 'Confirm Material Pull'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
         * VIEW 3: RETURN MATERIAL
         * ========================================================================= */}
        {activeView === 'return_material' && (
          <div className="max-w-3xl mx-auto bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                Return Unused Packaging Materials
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {isReturnOptionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading return form options...</p>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Job Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JOB-9388"
                      value={returnJobId}
                      onChange={(e) => setReturnJobId(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Trailer Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 102"
                      value={returnTrailerNumber}
                      onChange={(e) => setReturnTrailerNumber(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Returning Employee</label>
                    <select
                      required
                      value={returnEmployeeId}
                      onChange={(e) => setReturnEmployeeId(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="">-- Choose Employee --</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantities Grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                    Specify Material Quantities Returning to Stock
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-gray-700">
                    {allMaterialKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded hover:bg-[#262626]">
                        <span className="text-xs text-gray-300">{MATERIAL_LABELS[key]}</span>
                        <input
                          type="number"
                          min="0"
                          value={returnQuantities[key] || ''}
                          placeholder="0"
                          onChange={(e) =>
                            setReturnQuantities({
                              ...returnQuantities,
                              [key]: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-20 bg-[#262626] border border-gray-600 rounded px-2 py-1 text-xs text-right text-white focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                    <FileSignature className="w-4 h-4 text-amber-400" />
                    <span>Employee Digital Signature</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Type full legal name as digital signature"
                    value={returnSignature}
                    onChange={(e) => setReturnSignature(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={returnMutation.isPending}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{returnMutation.isPending ? 'Returning...' : 'Confirm Material Return'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
         * VIEW 4: ORDER MATERIAL (SUPPLIER)
         * ========================================================================= */}
        {activeView === 'order_material' && (
          <div className="max-w-3xl mx-auto bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                Order Materials from Supplier
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {isOrderOptionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading order form options...</p>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Purchase Order (PO) #</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PO-8821"
                      value={orderPoNumber}
                      onChange={(e) => setOrderPoNumber(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Supplier / Vendor Email</label>
                    <input
                      type="email"
                      required
                      placeholder="supplies@packagingcorp.com"
                      value={orderSupplierEmail}
                      onChange={(e) => setOrderSupplierEmail(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Delivery Destination Station</label>
                    <input
                      type="text"
                      required
                      value={orderStation}
                      onChange={(e) => setOrderStation(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Ordering Manager</label>
                    <select
                      required
                      value={orderEmployeeId}
                      onChange={(e) => setOrderEmployeeId(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="">-- Choose Manager --</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantities Grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                    Specify Material Quantities to Order
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-gray-700">
                    {allMaterialKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded hover:bg-[#262626]">
                        <span className="text-xs text-gray-300">{MATERIAL_LABELS[key]}</span>
                        <input
                          type="number"
                          min="0"
                          value={orderQuantities[key] || ''}
                          placeholder="0"
                          onChange={(e) =>
                            setOrderQuantities({
                              ...orderQuantities,
                              [key]: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-20 bg-[#262626] border border-gray-600 rounded px-2 py-1 text-xs text-right text-white focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                    <FileSignature className="w-4 h-4 text-blue-400" />
                    <span>Manager Digital Signature</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Type full legal name as digital authorization"
                    value={orderSignature}
                    onChange={(e) => setOrderSignature(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={orderMutation.isPending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{orderMutation.isPending ? 'Placing Order...' : 'Send Purchase Order'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
         * VIEW 5: RECORD RECEIPTS
         * ========================================================================= */}
        {activeView === 'record_receipt' && (
          <div className="max-w-2xl mx-auto bg-[#262626] border border-gray-700 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-400" />
                Record Daily Packaging Receipts
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <form onSubmit={handleRecordReceiptSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Receipt Date</label>
                <input
                  type="date"
                  required
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Delivery Receipt Details / Bill of Lading Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record carrier, delivery invoice number, verified pallet counts..."
                  value={receiptDetail}
                  onChange={(e) => setReceiptDetail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={recordReceiptMutation.isPending}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Receipt className="w-5 h-5" />
                <span>{recordReceiptMutation.isPending ? 'Recording...' : 'Save Receipt Entry'}</span>
              </button>
            </form>

            {/* Receipts Log for Date */}
            <div className="pt-4 border-t border-gray-700 space-y-3">
              <h3 className="text-sm font-bold text-gray-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Recorded Receipts for {receiptDate}
              </h3>
              {isReceiptsLoading ? (
                <p className="text-xs text-gray-400">Loading receipts...</p>
              ) : (
                <div className="space-y-2">
                  {receiptsData?.receipts?.map((r: any, idx: number) => (
                    <div
                      key={r.id || idx}
                      className="bg-[#1a1a1a] border border-gray-700 rounded p-2.5 text-xs text-gray-300"
                    >
                      {r.detail || r.material || JSON.stringify(r)}
                    </div>
                  ))}
                  {(!receiptsData?.receipts || receiptsData.receipts.length === 0) && (
                    <p className="text-xs text-gray-500 italic">No receipts recorded for this date yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PackagingPage;
