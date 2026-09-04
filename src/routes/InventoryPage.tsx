'use client';

import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Shirt,
  RotateCcw,
  PlusCircle,
  Box,
  MinusCircle,
  BarChart3,
  Users,
  Boxes,
  User,
  Check,
  Clock,
  Printer,
  CheckCircle2,
  Loader2,
  AlertCircle,
  PackageOpen,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  useInventoryDashboard,
  useIssueUniformFormOptions,
  useIssueUniform,
  useReturnUniformFormOptions,
  useReturnUniform,
  useEmployeeUniforms,
  useCreateUniform,
  useStockFormOptions,
  useAddInventoryStock,
  useStockRemoveFormOptions,
  useRemoveInventoryStock,
  useInventoryReports,
} from '../api/operationalApi';
import type {
  InventoryEmployeeAssignment,
  InventoryStockItem,
} from '../api/types';

type ActiveView =
  | 'dashboard'
  | 'uniform_issue'
  | 'uniform_return'
  | 'uniform_add'
  | 'inventory_add'
  | 'inventory_remove'
  | 'reports';

export const InventoryPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [dashboardTab, setDashboardTab] = useState<'assignments' | 'inventory'>('assignments');
  const [notification, setNotification] = useState<string | null>(null);

  // Issue Uniform State
  const [issueEmployeeId, setIssueEmployeeId] = useState<number | string>('');
  const [issueUniformId, setIssueUniformId] = useState<number | string>('');
  const [issueQuantity, setIssueQuantity] = useState<number>(1);
  const [issueCondition, setIssueCondition] = useState<'New' | 'Used'>('New');
  const [issueEmail, setIssueEmail] = useState('');

  // Return Uniform State
  const [returnEmployeeId, setReturnEmployeeId] = useState<number | string>('');
  const [returnUniformId, setReturnUniformId] = useState<number | string>('');
  const [returnEmail, setReturnEmail] = useState('');

  // Add Uniform State
  const [newUniformName, setNewUniformName] = useState('');
  const [newUniformCategory, setNewUniformCategory] = useState('');
  const [newUniformGender, setNewUniformGender] = useState<'Male' | 'Female' | 'Unisex'>('Unisex');
  const [newUniformMinStock, setNewUniformMinStock] = useState<number>(10);

  // Add Stock State
  const [stockUniformId, setStockUniformId] = useState<number | string>('');
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [stockCondition, setStockCondition] = useState<'New' | 'Used'>('New');
  const [stockNotes, setStockNotes] = useState('');

  // Remove Stock State
  const [removeUniformId, setRemoveUniformId] = useState<number | string>('');
  const [removeQuantity, setRemoveQuantity] = useState<number>(1);
  const [removeCondition, setRemoveCondition] = useState<'New' | 'Used'>('New');
  const [removeTxType, setRemoveTxType] = useState<'Return to Supplier' | 'Dispose'>('Dispose');
  const [removeNotes, setRemoveNotes] = useState('');

  // Reports State
  const [reportType, setReportType] = useState<'all' | 'inventory_summary' | 'employee_summary'>('inventory_summary');

  // Queries
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useInventoryDashboard();

  const { data: issueOptions, isLoading: isIssueOptionsLoading } = useIssueUniformFormOptions();
  const { data: returnOptions, isLoading: isReturnOptionsLoading } = useReturnUniformFormOptions();
  const { data: employeeUniformsData, isLoading: isEmployeeUniformsLoading } = useEmployeeUniforms(
    returnEmployeeId || undefined
  );
  const { data: stockOptions, isLoading: isStockOptionsLoading } = useStockFormOptions();
  const { data: removeOptions, isLoading: isRemoveOptionsLoading } = useStockRemoveFormOptions();
  const { data: reportsData, isLoading: isReportsLoading } = useInventoryReports(
    reportType === 'all' ? undefined : reportType
  );

  // Mutations
  const issueMutation = useIssueUniform();
  const returnMutation = useReturnUniform();
  const createUniformMutation = useCreateUniform();
  const addStockMutation = useAddInventoryStock();
  const removeStockMutation = useRemoveInventoryStock();

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Auto-fill email when issue employee changes
  useEffect(() => {
    if (issueEmployeeId && issueOptions?.employees) {
      const selected = issueOptions.employees.find((e) => String(e.id) === String(issueEmployeeId));
      if (selected && selected.email) {
        setIssueEmail(selected.email);
      }
    } else {
      setIssueEmail('');
    }
  }, [issueEmployeeId, issueOptions]);

  // Auto-fill email when return employee changes
  useEffect(() => {
    if (returnEmployeeId && returnOptions?.employees) {
      const selected = returnOptions.employees.find((e) => String(e.id) === String(returnEmployeeId));
      if (selected && selected.email) {
        setReturnEmail(selected.email);
      }
    } else {
      setReturnEmail('');
    }
    setReturnUniformId('');
  }, [returnEmployeeId, returnOptions]);

  // Handlers
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueEmployeeId || !issueUniformId) {
      alert('Please select both an employee and uniform');
      return;
    }
    try {
      await issueMutation.mutateAsync({
        employee: Number(issueEmployeeId),
        uniform: Number(issueUniformId),
        quantity: issueQuantity,
        condition: issueCondition,
        email: issueEmail || undefined,
      });
      showToast('Uniform issued successfully!');
      setIssueEmployeeId('');
      setIssueUniformId('');
      setIssueQuantity(1);
      setIssueCondition('New');
      setIssueEmail('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to issue uniform');
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnEmployeeId || !returnUniformId) {
      alert('Please select both an employee and uniform');
      return;
    }
    try {
      await returnMutation.mutateAsync({
        employee: Number(returnEmployeeId),
        uniform: Number(returnUniformId),
        email: returnEmail || undefined,
      });
      showToast('Uniform returned successfully!');
      setReturnEmployeeId('');
      setReturnUniformId('');
      setReturnEmail('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to return uniform');
    }
  };

  const handleAddUniformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniformName.trim()) {
      alert('Uniform name is required');
      return;
    }
    try {
      await createUniformMutation.mutateAsync({
        name: newUniformName.trim(),
        category: newUniformCategory.trim() || 'General',
        gender: newUniformGender,
        minimum_stock_level: newUniformMinStock,
      });
      showToast(`Uniform "${newUniformName}" created successfully!`);
      setNewUniformName('');
      setNewUniformCategory('');
      setNewUniformGender('Unisex');
      setNewUniformMinStock(10);
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to add uniform');
    }
  };

  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockUniformId) {
      alert('Please select a uniform');
      return;
    }
    try {
      await addStockMutation.mutateAsync({
        uniform: Number(stockUniformId),
        quantity: stockQuantity,
        condition: stockCondition,
        notes: stockNotes || undefined,
      });
      showToast('Inventory stock added successfully!');
      setStockUniformId('');
      setStockQuantity(1);
      setStockCondition('New');
      setStockNotes('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to add stock');
    }
  };

  const handleRemoveStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeUniformId) {
      alert('Please select a uniform');
      return;
    }
    try {
      await removeStockMutation.mutateAsync({
        uniform: Number(removeUniformId),
        quantity: removeQuantity,
        condition: removeCondition,
        transaction_type: removeTxType,
        notes: removeNotes || undefined,
      });
      showToast('Inventory stock removed successfully!');
      setRemoveUniformId('');
      setRemoveQuantity(1);
      setRemoveCondition('New');
      setRemoveTxType('Dispose');
      setRemoveNotes('');
      setActiveView('dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to remove stock');
    }
  };

  const stats = dashboardData?.stats;
  const assignments: InventoryEmployeeAssignment[] = dashboardData?.assignments || [];
  const stockItems: InventoryStockItem[] = dashboardData?.inventory || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col">
      {/* Header */}
      <header className="print:hidden">
        <Navbar isAuthenticated={true} user={user} onLogout={logout} />
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Flex container matching Django inventory_base.html */}
      <div className="flex flex-1 min-h-[calc(100vh-64px)]">
        {/* Sidebar (hidden on print) */}
        <aside className="w-full sm:w-48 md:w-64 bg-[#262626] text-white flex flex-col transition-all duration-300 ease-in-out print:hidden shrink-0">
          <nav className="flex-grow space-y-2 px-2 sm:px-4 mt-6">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'dashboard' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <Gauge className="w-5 h-5 mr-3 shrink-0" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('uniform_issue')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'uniform_issue' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <Shirt className="w-5 h-5 mr-3 shrink-0" />
              <span>Issue Uniform</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('uniform_return')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'uniform_return' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <RotateCcw className="w-5 h-5 mr-3 shrink-0" />
              <span>Return Uniform</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('uniform_add')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'uniform_add' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <PlusCircle className="w-5 h-5 mr-3 shrink-0" />
              <span>Add New Uniform</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('inventory_add')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'inventory_add' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <Box className="w-5 h-5 mr-3 shrink-0" />
              <span>Add Inventory</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('inventory_remove')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'inventory_remove' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <MinusCircle className="w-5 h-5 mr-3 shrink-0" />
              <span>Remove Inventory</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('reports')}
              className={`block w-full py-2.5 px-4 rounded text-white text-left transition-all duration-300 flex items-center cursor-pointer ${
                activeView === 'reports' ? 'bg-red-500 font-semibold' : 'hover:bg-red-500'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3 shrink-0" />
              <span>Reports</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow bg-black shadow-lg overflow-y-auto p-6 min-w-0">
          {/* =========================================================================
           * VIEW 1: DASHBOARD
           * ========================================================================= */}
          {activeView === 'dashboard' && (
            <div>
              {/* Dashboard Header */}
              <div className="mb-6">
                <h1 className="animate-heading text-3xl font-bold text-red-500 mb-2">Inventory Dashboard</h1>
                <p className="text-gray-400">Overview of inventory assignments and stock levels</p>
              </div>

              {isDashboardLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                  <p className="text-gray-400 text-sm">Loading inventory dashboard...</p>
                </div>
              ) : isDashboardError ? (
                <div className="bg-[#2a2a2a] border border-red-800/80 rounded-lg p-6 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                  <p className="text-red-300 font-semibold text-sm">Failed to load inventory dashboard</p>
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
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">
                        {stats?.total_employees_with_inventory ?? assignments.length}
                      </div>
                      <div className="text-sm text-gray-400">Employees with Inventory</div>
                    </div>

                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">
                        {stats?.total_items_assigned ?? 0}
                      </div>
                      <div className="text-sm text-gray-400">Items Assigned</div>
                    </div>

                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">
                        {stats?.total_new_stock ?? 0}
                      </div>
                      <div className="text-sm text-gray-400">New Stock</div>
                    </div>

                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stats?.total_used_stock ?? 0}
                      </div>
                      <div className="text-sm text-gray-400">Used Stock</div>
                    </div>

                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-500">
                        {stats?.total_in_use ?? 0}
                      </div>
                      <div className="text-sm text-gray-400">In Use</div>
                    </div>
                  </div>

                  {/* Tabbed Interface */}
                  <div className="bg-[#262626] rounded-lg">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-700 bg-[#262626]">
                      <nav className="flex -mb-px px-6" aria-label="Tabs">
                        <button
                          type="button"
                          onClick={() => setDashboardTab('assignments')}
                          className={`tab-button whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors cursor-pointer flex items-center ${
                            dashboardTab === 'assignments'
                              ? 'border-red-500 text-red-500'
                              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Employee Assignments
                        </button>
                        <button
                          type="button"
                          onClick={() => setDashboardTab('inventory')}
                          className={`tab-button whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors cursor-pointer flex items-center ${
                            dashboardTab === 'inventory'
                              ? 'border-red-500 text-red-500'
                              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          <Boxes className="w-4 h-4 mr-2" />
                          Inventory Stock
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content: Employee Assignments */}
                    {dashboardTab === 'assignments' && (
                      <div id="content-assignments" className="tab-content">
                        <div className="px-6 py-4 border-b border-gray-700">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-gray-400">Showing both active and returned items for complete history</p>
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <Check className="w-3 h-3 mr-1" /> Active
                                </span>
                                <span className="text-gray-400">= Currently with employee</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  <RotateCcw className="w-3 h-3 mr-1" /> Returned
                                </span>
                                <span className="text-gray-400">= Returned to inventory</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {assignments.length > 0 ? (
                          <div className="p-6">
                            <div className="space-y-6">
                              {assignments.map((empData, eidx) => {
                                const emp = empData.employee;
                                const empKey = emp?.id ?? `emp-${eidx}`;
                                return (
                                  <div key={empKey} className="border border-gray-700 rounded-lg p-5 bg-[#2a2a2a]">
                                    {/* Employee Header */}
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                                      <div className="flex items-center space-x-3">
                                        <div className="bg-red-500 rounded-full p-3 flex items-center justify-center">
                                          <User className="text-white w-5 h-5" />
                                        </div>
                                        <div>
                                          <h3 className="text-lg font-semibold text-white">
                                            {emp?.full_name || emp?.username || 'Staff Member'}
                                          </h3>
                                          <p className="text-sm text-gray-400">{emp?.email || 'No email on file'}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-400">Currently Assigned</p>
                                        <p className="text-2xl font-bold text-red-500">{empData.total_quantity}</p>
                                        {empData.items.length > empData.total_quantity && (
                                          <p className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" /> Includes history
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full">
                                        <thead>
                                          <tr className="border-b border-gray-700">
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Item</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Condition</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                          {empData.items.map((item) => (
                                            <tr key={item.id} className={item.status === 'Returned' ? 'opacity-60' : ''}>
                                              <td className="px-4 py-3 text-sm text-white">{item.uniform_name}</td>
                                              <td className="px-4 py-3 text-sm text-gray-400">{item.category || 'N/A'}</td>
                                              <td className="px-4 py-3 text-sm text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                  {item.quantity}
                                                </span>
                                              </td>
                                              <td className="px-4 py-3 text-sm text-center">
                                                {item.condition === 'New' ? (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    New
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Used
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-center">
                                                {item.status === 'Active' ? (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <Check className="w-3 h-3 mr-1" /> Active
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                                    <RotateCcw className="w-3 h-3 mr-1" /> Returned
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-400 text-center">
                                                {item.date_assigned || 'N/A'}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 text-center">
                            <PackageOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-xl text-gray-400 mb-2">No Active Inventory Assignments</p>
                            <p className="text-gray-500">Start by issuing uniforms to employees from the sidebar menu.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab Content: Inventory Stock */}
                    {dashboardTab === 'inventory' && (
                      <div id="content-inventory" className="tab-content">
                        {stockItems.length > 0 ? (
                          <div className="p-6">
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Uniform Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">New Stock</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Used Stock</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">In Use</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Stock</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Level</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                  {stockItems.map((item) => (
                                    <tr key={item.id} className={item.is_low_stock ? 'bg-red-900/20' : ''}>
                                      <td className="px-4 py-3 text-sm font-medium text-white">
                                        {item.uniform_name}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-400">
                                        {item.category || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-400 text-center">
                                        {item.gender || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          {item.new_stock}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                          {item.used_stock}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          {item.in_use}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm font-semibold text-center text-white">
                                        {item.total_stock}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-400 text-center">
                                        {item.minimum_stock_level ?? 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center">
                                        {item.is_low_stock ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Low Stock
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Normal
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 text-center">
                            <PackageOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-xl text-gray-400 mb-2">No Inventory Stock Records</p>
                            <p className="text-gray-500">Add uniforms and stock entries from the sidebar menu.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 2: ISSUE UNIFORM
           * ========================================================================= */}
          {activeView === 'uniform_issue' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Issue Uniform</h1>

              {isIssueOptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleIssueSubmit} className="space-y-6">
                  {/* Uniform Issue Information */}
                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Issue Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="id_employee" className="block text-gray-300 font-medium mb-2">
                          Employee
                        </label>
                        <select
                          id="id_employee"
                          required
                          value={issueEmployeeId}
                          onChange={(e) => setIssueEmployeeId(e.target.value)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="">Select an Employee</option>
                          {issueOptions?.employees?.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.full_name} ({emp.email || 'No email'})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="id_uniform" className="block text-gray-300 font-medium mb-2">
                          Uniform
                        </label>
                        <select
                          id="id_uniform"
                          required
                          value={issueUniformId}
                          onChange={(e) => setIssueUniformId(e.target.value)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="">Select a Uniform</option>
                          {issueOptions?.uniforms?.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.category || 'Standard'})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Condition */}
                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="id_quantity" className="block text-gray-300 font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="id_quantity"
                          min="1"
                          required
                          value={issueQuantity}
                          onChange={(e) => setIssueQuantity(parseInt(e.target.value, 10) || 1)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="id_condition" className="block text-gray-300 font-medium mb-2">
                          Condition
                        </label>
                        <select
                          id="id_condition"
                          value={issueCondition}
                          onChange={(e) => setIssueCondition(e.target.value as 'New' | 'Used')}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={issueEmail}
                          onChange={(e) => setIssueEmail(e.target.value)}
                          placeholder="employee@firehousemovers.com"
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={issueMutation.isPending}
                      className="text-white font-medium py-3 px-6 bg-[#262626] hover:bg-red-600 transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      {issueMutation.isPending ? 'Issuing...' : 'Issue Uniform'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 3: RETURN UNIFORM
           * ========================================================================= */}
          {activeView === 'uniform_return' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Return Uniform</h1>

              {isReturnOptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-6">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <div>
                      <label htmlFor="id_return_employee" className="block text-gray-300 font-medium mb-2">
                        Employee
                      </label>
                      <select
                        id="id_return_employee"
                        required
                        value={returnEmployeeId}
                        onChange={(e) => setReturnEmployeeId(e.target.value)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      >
                        <option value="">Select an Employee</option>
                        {returnOptions?.employees?.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.full_name} ({emp.email || 'No email'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="id_return_uniform" className="block text-gray-300 font-medium mb-2">
                        Uniform
                      </label>
                      <select
                        id="id_return_uniform"
                        required
                        value={returnUniformId}
                        onChange={(e) => setReturnUniformId(e.target.value)}
                        disabled={!returnEmployeeId || isEmployeeUniformsLoading}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full disabled:opacity-50"
                      >
                        <option value="">
                          {isEmployeeUniformsLoading
                            ? 'Loading employee assigned uniforms...'
                            : !returnEmployeeId
                            ? 'Select an employee first'
                            : employeeUniformsData?.uniforms?.length === 0
                            ? 'No uniforms currently assigned'
                            : 'Select a Uniform to Return'}
                        </option>
                        {employeeUniformsData?.uniforms?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} (Assigned: {u.quantity})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="return_email" className="block text-gray-300 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="return_email"
                        value={returnEmail}
                        onChange={(e) => setReturnEmail(e.target.value)}
                        placeholder="employee@firehousemovers.com"
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={returnMutation.isPending}
                      className="text-white font-medium py-3 px-6 bg-[#262626] hover:bg-red-600 transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      {returnMutation.isPending ? 'Returning...' : 'Return Uniform'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 4: ADD NEW UNIFORM
           * ========================================================================= */}
          {activeView === 'uniform_add' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Add Uniform</h1>

              <form onSubmit={handleAddUniformSubmit} className="space-y-6">
                {/* Uniform Details */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Uniform Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="id_new_name" className="block text-gray-300 font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="id_new_name"
                        required
                        placeholder="e.g. Firehouse Red Polo"
                        value={newUniformName}
                        onChange={(e) => setNewUniformName(e.target.value)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="id_new_category" className="block text-gray-300 font-medium mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        id="id_new_category"
                        placeholder="e.g. Shirts, Pants, Safety"
                        value={newUniformCategory}
                        onChange={(e) => setNewUniformCategory(e.target.value)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender and Stock Level */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="id_new_gender" className="block text-gray-300 font-medium mb-2">
                        Gender
                      </label>
                      <select
                        id="id_new_gender"
                        value={newUniformGender}
                        onChange={(e) => setNewUniformGender(e.target.value as any)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="id_new_min_stock" className="block text-gray-300 font-medium mb-2">
                        Minimum Stock Level
                      </label>
                      <input
                        type="number"
                        id="id_new_min_stock"
                        min="0"
                        value={newUniformMinStock}
                        onChange={(e) => setNewUniformMinStock(parseInt(e.target.value, 10) || 0)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={createUniformMutation.isPending}
                    className="text-white font-medium py-3 px-6 bg-[#262626] hover:bg-red-600 transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {createUniformMutation.isPending ? 'Adding...' : 'Add Uniform'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
           * VIEW 5: ADD INVENTORY
           * ========================================================================= */}
          {activeView === 'inventory_add' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Add Inventory</h1>

              {isStockOptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleAddStockSubmit} className="space-y-6">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Inventory Details</h2>
                    <div>
                      <label htmlFor="id_stock_uniform" className="block text-gray-300 font-medium mb-2">
                        Uniform
                      </label>
                      <select
                        id="id_stock_uniform"
                        required
                        value={stockUniformId}
                        onChange={(e) => setStockUniformId(e.target.value)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      >
                        <option value="">Select a Uniform</option>
                        {stockOptions?.uniforms?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="id_stock_qty" className="block text-gray-300 font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="id_stock_qty"
                          min="1"
                          required
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 1)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="id_stock_condition" className="block text-gray-300 font-medium mb-2">
                          Condition
                        </label>
                        <select
                          id="id_stock_condition"
                          value={stockCondition}
                          onChange={(e) => setStockCondition(e.target.value as any)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                        </select>
                      </div>
                    </div>
                    <div className="w-full">
                      <label htmlFor="id_stock_notes" className="block text-gray-300 font-medium mb-2">
                        Notes
                      </label>
                      <textarea
                        id="id_stock_notes"
                        rows={3}
                        value={stockNotes}
                        onChange={(e) => setStockNotes(e.target.value)}
                        placeholder="Purchased from vendor, restocked shipment..."
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={addStockMutation.isPending}
                      className="text-white font-medium py-3 px-6 bg-[#262626] hover:bg-red-600 transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      {addStockMutation.isPending ? 'Adding Stock...' : 'Add Inventory'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 6: REMOVE INVENTORY
           * ========================================================================= */}
          {activeView === 'inventory_remove' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Remove Inventory</h1>

              {isRemoveOptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleRemoveStockSubmit} className="space-y-6">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Inventory Details</h2>
                    <div>
                      <label htmlFor="id_remove_uniform" className="block text-gray-300 font-medium mb-2">
                        Uniform
                      </label>
                      <select
                        id="id_remove_uniform"
                        required
                        value={removeUniformId}
                        onChange={(e) => setRemoveUniformId(e.target.value)}
                        className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      >
                        <option value="">Select a Uniform</option>
                        {removeOptions?.uniforms?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="id_remove_qty" className="block text-gray-300 font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="id_remove_qty"
                          min="1"
                          required
                          value={removeQuantity}
                          onChange={(e) => setRemoveQuantity(parseInt(e.target.value, 10) || 1)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="id_remove_condition" className="block text-gray-300 font-medium mb-2">
                          Condition
                        </label>
                        <select
                          id="id_remove_condition"
                          value={removeCondition}
                          onChange={(e) => setRemoveCondition(e.target.value as any)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="New">New</option>
                          <option value="Used">Used</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="id_remove_type" className="block text-gray-300 font-medium mb-2">
                          Type
                        </label>
                        <select
                          id="id_remove_type"
                          value={removeTxType}
                          onChange={(e) => setRemoveTxType(e.target.value as any)}
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        >
                          <option value="Dispose">Dispose</option>
                          <option value="Return to Supplier">Return to Supplier</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="id_remove_notes" className="block text-gray-300 font-medium mb-2">
                          Notes
                        </label>
                        <input
                          type="text"
                          id="id_remove_notes"
                          value={removeNotes}
                          onChange={(e) => setRemoveNotes(e.target.value)}
                          placeholder="Reason for disposal/return..."
                          className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={removeStockMutation.isPending}
                      className="text-white font-medium py-3 px-6 bg-[#262626] hover:bg-red-600 transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      {removeStockMutation.isPending ? 'Removing...' : 'Remove Inventory'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
           * VIEW 7: REPORTS
           * ========================================================================= */}
          {activeView === 'reports' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="animate-heading text-3xl font-bold text-red-500 mb-6">Reports</h1>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#262626] hover:bg-red-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer print:hidden"
                >
                  <Printer className="w-4 h-4" /> Print Report
                </button>
              </div>

              {/* Selector (hidden on print) */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg space-y-4 print:hidden">
                <div>
                  <label htmlFor="id_report_type" className="block text-gray-300 font-medium mb-2">
                    Select Report Type
                  </label>
                  <select
                    id="id_report_type"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  >
                    <option value="inventory_summary">Summary by Inventory</option>
                    <option value="employee_summary">Summary by Employee</option>
                  </select>
                </div>
              </div>

              {isReportsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Inventory Report Table */}
                  {reportType === 'inventory_summary' && reportsData?.inventory_records && (
                    <div className="p-2 overflow-y-auto">
                      <h2 className="text-2xl font-bold text-white mb-6">Inventory Report</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-[#2a2a2a] shadow-lg rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-[#262626] text-white">
                              <th className="px-4 py-3 text-left">Uniform Name</th>
                              <th className="px-4 py-3 text-left">New Stock</th>
                              <th className="px-4 py-3 text-left">Used Stock</th>
                              <th className="px-4 py-3 text-left">In Use</th>
                              <th className="px-4 py-3 text-left">Total Stock</th>
                              <th className="px-4 py-3 text-left">Disposed</th>
                              <th className="px-4 py-3 text-left">Return to Supplier</th>
                              <th className="px-4 py-3 text-left">Total Bought</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {reportsData.inventory_records.map((record, idx) => (
                              <tr key={record.id || idx} className="border-t border-gray-700 even:bg-[#1f1f1f]">
                                <td className="px-4 py-3">{record.uniform_name || 'N/A'}</td>
                                <td className="px-4 py-3 text-left">{record.new_stock || 0}</td>
                                <td className="px-4 py-3 text-left">{record.used_stock || 0}</td>
                                <td className="px-4 py-3 text-left">{record.in_use || 0}</td>
                                <td className="px-4 py-3 text-left">{record.total_stock || 0}</td>
                                <td className="px-4 py-3 text-left">{record.disposed || 0}</td>
                                <td className="px-4 py-3 text-left">{record.return_to_supplier || 0}</td>
                                <td className="px-4 py-3 text-left">{record.total_bought || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Employee Report Table */}
                  {reportType === 'employee_summary' && reportsData?.employee_records && (
                    <div className="p-2 overflow-y-auto">
                      <h2 className="text-2xl font-bold text-white mb-6">Employee Report</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-[#2a2a2a] shadow-lg rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-[#262626] text-white">
                              <th className="px-4 py-3 text-left">Employee</th>
                              <th className="px-4 py-3 text-left">Uniform</th>
                              <th className="px-4 py-3 text-left">Quantity</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {reportsData.employee_records.map((rec, eidx) => {
                              const empName = rec.employee?.full_name || 'Staff Member';
                              return rec.uniforms.map((u, uidx) => (
                                <tr key={`${eidx}-${uidx}`} className="border-t border-gray-700 even:bg-[#1f1f1f]">
                                  <td className="px-4 py-3">{empName}</td>
                                  <td className="px-4 py-3">{u.name}</td>
                                  <td className="px-4 py-3">{u.quantity}</td>
                                </tr>
                              ));
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
