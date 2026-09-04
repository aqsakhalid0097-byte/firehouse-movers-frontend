'use client';

import React, { useState } from 'react';
import {
  Gift,
  PlusCircle,
  BarChart3,
  Building2,
  Check,
  CreditCard,
  User,
  Trash2,
  Edit2,
  ArrowLeft,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { canManageGiftCards } from '../utils/rbac';
import {
  useGiftsDashboard,
  useGiftIssueFormOptions,
  useCreateGiftCard,
  useUpdateGiftCard,
  useDeleteGiftCard,
  useCreateGiftCompany,
  useAwardGiftCard,
  useGiftReports,
} from '../api/operationalApi';
import type { GiftCard, GiftAward, GiftCompany, PeopleDirectoryMember } from '../api/types';

type ActiveView = 'dashboard' | 'add_card' | 'award_card' | 'reports';

export const GiftCardsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [activeTab, setActiveTab] = useState<'issued' | 'added'>('issued');
  const [notification, setNotification] = useState<string | null>(null);

  // Add Gift Card state
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>('');
  const [newCardAmount, setNewCardAmount] = useState('50');

  // Award Gift Card state
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | string>('');
  const [awardReason, setAwardReason] = useState('');

  // Reports state
  const [reportPeriod, setReportPeriod] = useState<'custom' | 'monthly' | 'annual'>('monthly');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Edit / Delete Modal states
  const [editingCard, setEditingCard] = useState<GiftCard | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);

  // Queries
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useGiftsDashboard({ tab: activeTab });

  const { data: formOptions, isLoading: isFormOptionsLoading } = useGiftIssueFormOptions();
  const { data: reportData, isLoading: isReportsLoading, refetch: refetchReports } = useGiftReports({
    start_date: startDate,
    end_date: endDate,
    report_type: reportPeriod,
  });

  // Mutations
  const createCompanyMutation = useCreateGiftCompany();
  const createCardMutation = useCreateGiftCard();
  const updateCardMutation = useUpdateGiftCard();
  const deleteCardMutation = useDeleteGiftCard();
  const awardCardMutation = useAwardGiftCard();

  const isManagement = canManageGiftCards(user);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Extract issued & added lists safely from backend
  const issuedAwards: GiftAward[] = Array.isArray(dashboardData?.issued?.results)
    ? (dashboardData.issued.results as GiftAward[])
    : Array.isArray(dashboardData?.issued)
    ? (dashboardData.issued as unknown as GiftAward[])
    : [];

  const addedCards: GiftCard[] = Array.isArray(dashboardData?.added?.results)
    ? (dashboardData.added.results as GiftCard[])
    : Array.isArray(dashboardData?.added)
    ? (dashboardData.added as unknown as GiftCard[])
    : [];

  const availableCompanies: GiftCompany[] = formOptions?.companies || [];
  const availableEmployees: PeopleDirectoryMember[] = formOptions?.employees || [];
  const unassignedCards: GiftCard[] = (formOptions?.gift_cards || addedCards).filter(
    (c) => !c.has_awards
  );

  // Handler: Save New Company
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      const res = await createCompanyMutation.mutateAsync({ name: newCompanyName.trim() });
      if (res.company?.id) {
        setSelectedCompanyId(res.company.id);
      }
      setNewCompanyName('');
      setShowCompanyForm(false);
      showToast(`Company Added: ${newCompanyName.trim()}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create company');
    }
  };

  // Handler: Add Gift Card
  const handleAddGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const compId = Number(selectedCompanyId) || (availableCompanies[0]?.id ? availableCompanies[0].id : 0);
    if (!compId) {
      alert('Please select a company');
      return;
    }
    const amt = parseInt(newCardAmount, 10) || 50;

    try {
      await createCardMutation.mutateAsync({
        company: compId,
        amount: amt,
      });
      showToast(`Gift card ($${amt}) added successfully!`);
      setActiveView('dashboard');
      setActiveTab('added');
    } catch (err: any) {
      alert(err.message || 'Failed to add gift card');
    }
  };

  // Handler: Award Gift Card
  const handleAwardCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployeeIds.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    const cardId = Number(selectedCardId) || unassignedCards[0]?.id;
    if (!cardId) {
      alert('Please select a gift card to award');
      return;
    }

    const selectedEmails = availableEmployees
      .filter((e) => selectedEmployeeIds.includes(e.id))
      .map((e) => (e as any).email || '')
      .filter(Boolean);

    try {
      await awardCardMutation.mutateAsync({
        employees: selectedEmployeeIds,
        card: cardId,
        reason: awardReason || 'Recognition for outstanding moving operations',
        emails: selectedEmails,
      });
      setSelectedEmployeeIds([]);
      setAwardReason('');
      showToast(`Gift card successfully distributed to ${selectedEmployeeIds.length} employee(s)!`);
      setActiveView('dashboard');
      setActiveTab('issued');
    } catch (err: any) {
      alert(err.message || 'Failed to award gift card');
    }
  };

  // Handler: Update Gift Card
  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    const amt = parseInt(editAmount, 10) || editingCard.amount;

    try {
      await updateCardMutation.mutateAsync({
        id: editingCard.id,
        payload: { amount: amt },
      });
      setEditingCard(null);
      showToast(`Card #${editingCard.id} updated.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update gift card');
    }
  };

  // Handler: Delete Gift Card
  const handleDeleteCard = async (cardId: number) => {
    try {
      await deleteCardMutation.mutateAsync(cardId);
      setDeletingCardId(null);
      showToast('Gift card deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete gift card');
    }
  };

  // Computed summary metrics
  const totalSpending =
    reportData?.spending && typeof reportData.spending.total === 'number'
      ? reportData.spending.total
      : addedCards.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  const totalIssued =
    reportData?.issuing && typeof reportData.issuing.total === 'number'
      ? reportData.issuing.total
      : issuedAwards.reduce((acc, a) => acc + (Number(a.amount) || 0), 0);

  const netSpending = reportData?.net_spending !== undefined ? reportData.net_spending : totalSpending - totalIssued;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#262626] via-[#1a1a1a] to-[#262626] text-gray-100 font-sans antialiased"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Top Navbar */}
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

      {/* =========================================================================
       * VIEW 1: GIFTS DASHBOARD
       * ========================================================================= */}
      {activeView === 'dashboard' && (
        <div className="pt-10 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="animate-heading text-4xl md:text-5xl font-bold text-white mb-2">Gift Cards</h1>
              <p className="text-gray-400 text-lg">Track recently issued and added gift cards</p>
            </div>

            {/* Action Buttons for Management */}
            {isManagement && (
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveView('add_card')}
                  className="px-6 py-3 bg-[#262626] hover:bg-[#333] text-white rounded-lg border border-gray-700 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-5 h-5 text-green-400" />
                  <span>Add Gift Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('award_card')}
                  className="px-6 py-3 bg-[#262626] hover:bg-[#333] text-white rounded-lg border border-gray-700 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Gift className="w-5 h-5 text-red-400" />
                  <span>Award Gift Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('reports')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Reports</span>
                </button>
              </div>
            )}

            {/* Tabs Container */}
            <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-700 flex">
                <button
                  type="button"
                  onClick={() => setActiveTab('issued')}
                  className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-300 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'issued'
                      ? 'border-red-500 text-white bg-[#1a1a1a]'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Gift className="w-5 h-5 text-red-400" />
                  <span>Recently Issued</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({issuedAwards.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('added')}
                  className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-300 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'added'
                      ? 'border-red-500 text-white bg-[#1a1a1a]'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <PlusCircle className="w-5 h-5 text-green-400" />
                  <span>Recently Added</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({addedCards.length})
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {isDashboardLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading gift cards...</p>
                  </div>
                ) : isDashboardError ? (
                  <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-6 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <p className="text-red-300 font-semibold text-sm">Failed to load gift cards dashboard</p>
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
                    {/* Recently Issued Tab */}
                    {activeTab === 'issued' && (
                      <div>
                        {issuedAwards.length > 0 ? (
                          <div className="space-y-4">
                            {issuedAwards.map((award) => (
                              <div
                                key={award.id}
                                className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:border-red-500 transition-all duration-300"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="text-red-400 w-5 h-5" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-white">
                                          {award.employee?.full_name || 'Employee'}
                                        </p>
                                        <p className="text-sm text-gray-400">{award.date_award}</p>
                                      </div>
                                    </div>

                                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-gray-400">Company</p>
                                          <p className="font-semibold text-white">
                                            {award.card?.company?.name || award.category?.name || 'Gift Card'}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm text-gray-400">Amount</p>
                                          <p className="font-bold text-red-400 text-lg">${award.amount}</p>
                                        </div>
                                      </div>
                                      {award.reason && (
                                        <p className="text-sm text-gray-300 mt-2 italic">
                                          "{award.reason}"
                                        </p>
                                      )}
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                      <span>
                                        Awarded by: {award.awarded_by?.full_name || 'Management'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Gift className="w-12 h-12 text-gray-600 mb-4 mx-auto" />
                            <p className="text-gray-400">No gift cards have been issued yet</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recently Added Tab */}
                    {activeTab === 'added' && (
                      <div>
                        {addedCards.length > 0 ? (
                          <div className="space-y-4">
                            {addedCards.map((card) => (
                              <div
                                key={card.id}
                                className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-all duration-300"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="text-green-400 w-5 h-5" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-white text-lg">
                                          {card.company?.name || card.label || 'Gift Card'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                          {card.date_of_purchase || 'In Inventory'}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-gray-400">Card ID</p>
                                          <p className="font-mono text-white">#{card.id}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm text-gray-400">Amount</p>
                                          <p className="font-bold text-green-400 text-lg">${card.amount}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                      <span className="text-xs text-gray-500">
                                        Added by: {card.added_by?.full_name || 'Management'}{' '}
                                        {card.has_awards && (
                                          <span className="text-amber-400 ml-2 font-medium">(Awarded)</span>
                                        )}
                                      </span>
                                      {isManagement && (
                                        <div className="flex gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingCard(card);
                                              setEditAmount(String(card.amount));
                                            }}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-all duration-300 flex items-center gap-1 cursor-pointer"
                                            title="Edit gift card"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                            <span>Edit</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeletingCardId(card.id)}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-all duration-300 flex items-center gap-1 cursor-pointer"
                                            title="Delete gift card"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Delete</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <CreditCard className="w-12 h-12 text-gray-600 mb-4 mx-auto" />
                            <p className="text-gray-400">No gift cards have been added yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * VIEW 2: ADD GIFT CARD
       * ========================================================================= */}
      {activeView === 'add_card' && (
        <div className="pt-10 pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="animate-heading text-4xl md:text-5xl font-bold text-white mb-2">Add Gift Card</h1>
              <p className="text-gray-400 text-lg">Add a new gift card to inventory</p>
            </div>

            {/* Add Company Section */}
            <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500" />
                  <span>Add New Company</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowCompanyForm(!showCompanyForm)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm font-medium"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{showCompanyForm ? 'Cancel' : 'Add Company'}</span>
                </button>
              </div>

              {/* Company Form (Collapsible) */}
              {showCompanyForm && (
                <form onSubmit={handleSaveCompany} className="space-y-4 pt-2 border-t border-gray-700">
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      required
                      placeholder="e.g. Best Buy, Walmart, Starbucks"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createCompanyMutation.isPending}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{createCompanyMutation.isPending ? 'Saving...' : 'Save Company'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCompanyForm(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Gift Card Form */}
            <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                <span>Gift Card Details</span>
              </h2>

              <form onSubmit={handleAddGiftCard} className="space-y-6">
                {/* Company Select Field */}
                <div>
                  <label htmlFor="card_company" className="block text-sm font-medium text-gray-300 mb-2">
                    Select Company
                  </label>
                  <select
                    id="card_company"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-sm"
                  >
                    <option value="">-- Choose Company --</option>
                    {availableCompanies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Don't see the company?{' '}
                    <button
                      type="button"
                      onClick={() => setShowCompanyForm(true)}
                      className="text-green-400 hover:text-green-300 underline cursor-pointer"
                    >
                      Add it here
                    </button>
                  </p>
                </div>

                {/* Amount Field */}
                <div>
                  <label htmlFor="card_amount" className="block text-sm font-medium text-gray-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    id="card_amount"
                    min="1"
                    required
                    value={newCardAmount}
                    onChange={(e) => setNewCardAmount(e.target.value)}
                    className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-sm"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createCardMutation.isPending}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>{createCardMutation.isPending ? 'Adding...' : 'Add Gift Card'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('award_card')}
                    className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#333] border border-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-5 h-5 text-red-400" />
                    <span>Award Card</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Back to Dashboard Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Gift Cards Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * VIEW 3: AWARD GIFT CARD
       * ========================================================================= */}
      {activeView === 'award_card' && (
        <div className="pt-10 pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="animate-heading text-4xl md:text-5xl font-bold text-white mb-2">Award Gift Card</h1>
              <p className="text-gray-400 text-lg">Distribute gift cards to employees</p>
            </div>

            {/* Form Card */}
            <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg p-6 md:p-8">
              {isFormOptionsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <p className="text-gray-400 text-sm">Loading eligible employees and cards...</p>
                </div>
              ) : (
                <form onSubmit={handleAwardCard} className="space-y-6">
                  {/* Employees Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>Select Employees</span>
                    </label>
                    <div className="border border-gray-700 bg-[#1a1a1a] rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                      {availableEmployees.map((emp) => {
                        const isSelected = selectedEmployeeIds.includes(emp.id);
                        return (
                          <label
                            key={emp.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-[#262626] cursor-pointer text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEmployeeIds([...selectedEmployeeIds, emp.id]);
                                  } else {
                                    setSelectedEmployeeIds(
                                      selectedEmployeeIds.filter((id) => id !== emp.id)
                                    );
                                  }
                                }}
                                className="rounded border-gray-700 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-white font-medium">{emp.full_name}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {(emp as any).email || emp.job_title}
                            </span>
                          </label>
                        );
                      })}
                      {availableEmployees.length === 0 && (
                        <p className="text-gray-500 text-xs text-center py-2">No employees found</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select one or more employees to award gift cards ({selectedEmployeeIds.length} selected)
                    </p>
                  </div>

                  {/* Card Number Field */}
                  <div>
                    <label
                      htmlFor="award_card_select"
                      className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-red-400" />
                      <span>Card Number</span>
                    </label>
                    <select
                      id="award_card_select"
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-sm"
                    >
                      <option value="">-- Select Available Gift Card --</option>
                      {unassignedCards.map((card) => (
                        <option key={card.id} value={card.id}>
                          #{card.id} - ({card.company?.name || card.label || 'Card'} - ${card.amount})
                        </option>
                      ))}
                    </select>
                    {unassignedCards.length === 0 && (
                      <p className="text-xs text-amber-400 mt-1">
                        No unassigned gift cards available in inventory. Please add a card first.
                      </p>
                    )}
                  </div>

                  {/* Reason Field */}
                  <div>
                    <label
                      htmlFor="award_reason_input"
                      className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Reason for Gift Given</span>
                    </label>
                    <textarea
                      id="award_reason_input"
                      rows={3}
                      required
                      placeholder="e.g. Zero-damage record, 5-star customer feedback, high reliability score..."
                      value={awardReason}
                      onChange={(e) => setAwardReason(e.target.value)}
                      className="border border-gray-600 bg-[#1a1a1a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-sm"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={awardCardMutation.isPending || unassignedCards.length === 0}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Gift className="w-5 h-5" />
                      <span>
                        {awardCardMutation.isPending ? 'Distributing...' : 'Distribute Gift Card'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('add_card')}
                      className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#333] border border-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Add Card</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Back to Dashboard Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Gift Cards Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * VIEW 4: GIFT CARD REPORTS
       * ========================================================================= */}
      {activeView === 'reports' && (
        <div className="pt-10 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="animate-heading text-4xl md:text-5xl font-bold text-white mb-2">Gift Card Reports</h1>
                  <p className="text-gray-400 text-lg">Spending and issuing analysis</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 print:hidden cursor-pointer shadow-md font-medium"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Date Filter Form */}
            <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg p-6 mb-6 print:hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="report_period_select" className="block text-sm font-medium text-gray-300 mb-2">
                    Report Period
                  </label>
                  <select
                    id="report_period_select"
                    value={reportPeriod}
                    onChange={(e) => {
                      const val = e.target.value as 'custom' | 'monthly' | 'annual';
                      setReportPeriod(val);
                      const now = new Date();
                      if (val === 'monthly') {
                        setStartDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
                        setEndDate(now.toISOString().split('T')[0]);
                      } else if (val === 'annual') {
                        setStartDate(new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]);
                        setEndDate(now.toISOString().split('T')[0]);
                      }
                    }}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="custom">Custom Range</option>
                    <option value="monthly">This Month</option>
                    <option value="annual">This Year</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="report_start_date" className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="report_start_date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="report_end_date" className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="report_end_date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => refetchReports()}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 cursor-pointer font-medium text-sm"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Report Period Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-white flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>
                  <strong>Report Period:</strong> {startDate} to {endDate}
                </span>
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-2 print:mb-4">
              {/* Spending Summary */}
              <div className="bg-[#262626] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Spending</h3>
                  <DollarSign className="text-green-400 text-2xl print:hidden" />
                </div>
                <p className="text-3xl font-bold text-green-400 mb-2">
                  ${Number(totalSpending || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">{addedCards.length} gift cards added</p>
              </div>

              {/* Issuing Summary */}
              <div className="bg-[#262626] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Issued</h3>
                  <Gift className="text-red-400 text-2xl print:hidden" />
                </div>
                <p className="text-3xl font-bold text-red-400 mb-2">
                  ${Number(totalIssued || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">{issuedAwards.length} awards given</p>
              </div>

              {/* Net Spending */}
              <div className="bg-[#262626] border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Net Spending</h3>
                  <TrendingUp className="text-blue-400 text-2xl print:hidden" />
                </div>
                <p
                  className={`text-3xl font-bold mb-2 ${
                    netSpending >= 0 ? 'text-blue-400' : 'text-yellow-400'
                  }`}
                >
                  ${Number(netSpending || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">Spending - Issued</p>
              </div>
            </div>

            {isReportsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Generating report analysis...</p>
              </div>
            ) : (
              /* Two Column Layout */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-3">
                {/* Spending Report */}
                <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a1a1a] to-[#262626] border-b border-gray-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500 print:hidden" />
                      <span>Spending Report</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Gift cards added to inventory</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Additions</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {addedCards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {card.company?.name || card.label || 'Gift Card'}
                            </p>
                            <p className="text-gray-400 text-xs">{card.date_of_purchase || 'In Stock'}</p>
                          </div>
                          <p className="font-semibold text-green-400">${card.amount}</p>
                        </div>
                      ))}
                      {addedCards.length === 0 && (
                        <p className="text-gray-500 text-sm py-4 text-center">No additions recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Issuing Report */}
                <div className="bg-[#262626] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a1a1a] to-[#262626] border-b border-gray-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Gift className="w-5 h-5 text-red-500 print:hidden" />
                      <span>Issuing Report</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Gift cards awarded to employees</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Awards</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {issuedAwards.map((award) => (
                        <div
                          key={award.id}
                          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-medium">{award.employee?.full_name || 'Staff'}</p>
                            <p className="text-gray-400 text-xs">{award.date_award}</p>
                          </div>
                          <p className="font-semibold text-red-400">${award.amount}</p>
                        </div>
                      ))}
                      {issuedAwards.length === 0 && (
                        <p className="text-gray-500 text-sm py-4 text-center">No awards issued</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Dashboard Link */}
            <div className="mt-6 text-center print:hidden">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Gift Cards Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#262626] border border-gray-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-400" />
              <span>Edit Gift Card #{editingCard.id}</span>
            </h3>
            <form onSubmit={handleUpdateCard} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  disabled
                  value={editingCard.company?.name || editingCard.label || ''}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2.5 text-gray-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCardMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  {updateCardMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCardId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#262626] border border-gray-700 rounded-xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Delete Gift Card?</h3>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete gift card #{deletingCardId}? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCardId(null)}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteCardMutation.isPending}
                onClick={() => handleDeleteCard(deletingCardId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                {deleteCardMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardsPage;
