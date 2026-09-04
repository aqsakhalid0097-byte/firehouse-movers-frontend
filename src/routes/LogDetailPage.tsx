'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Lock,
  User,
  UserCheck,
  FileSignature,
  Loader2,
  AlertCircle,
  RefreshCw,
  ThumbsUp,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  FileText,
  MessageSquare,
  Building,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { AcknowledgeModal } from '../features/communication/AcknowledgeModal';
import {
  useCommunicationLogDetail,
  useAcknowledgeCommunicationLog,
} from '../api/staffPortalApi';
import type { AcknowledgeLogPayload } from '../api/types';

// Helper to determine if a signature string is an image data URL or image path
const isImageSignature = (sig?: string | null): boolean => {
  if (!sig) return false;
  return (
    sig.startsWith('data:image/') ||
    sig.startsWith('http://') ||
    sig.startsWith('https://') ||
    sig.startsWith('/media/') ||
    sig.startsWith('/static/') ||
    /\.(png|jpg|jpeg|svg|webp)($|\?)/i.test(sig)
  );
};

const SignatureDisplay: React.FC<{
  signature: string | null;
  signerName?: string;
  timestamp?: string | null;
}> = ({ signature, signerName, timestamp }) => {
  if (!signature) return null;

  return (
    <div className="bg-[#242424] border border-neutral-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <FileSignature className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-white">Digital Signature</span>
        {timestamp && (
          <span className="text-[11px] text-gray-400">
            ({new Date(timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })})
          </span>
        )}
      </div>

      {isImageSignature(signature) ? (
        <div className="border border-neutral-700 rounded-lg p-2 bg-white inline-block shadow-sm">
          <img
            src={signature}
            alt={signerName ? `${signerName}'s Signature` : 'Signature'}
            className="max-w-full h-auto object-contain"
            style={{ maxHeight: '75px' }}
          />
        </div>
      ) : (
        <div className="inline-flex items-center gap-3 bg-[#1c1c1c] border border-neutral-700/80 px-4 py-2.5 rounded-lg">
          <span className="font-serif italic text-lg sm:text-xl text-emerald-400 font-semibold tracking-wide select-none">
            {signature}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 border-l border-neutral-700 pl-2">
            Verified
          </span>
        </div>
      )}
    </div>
  );
};

export const LogDetailPage: React.FC = () => {
  const params = useParams<{ logId?: string }>();
  const logId = params?.logId;
  const { user, logout } = useAuth();
  const { data: log, isLoading, error, refetch } = useCommunicationLogDetail(logId);
  const acknowledgeMutation = useAcknowledgeCommunicationLog();
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const formatLongDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getLogTypeBadge = (name?: string) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('positive') || n.includes('commend')) {
      return {
        className: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
        icon: <ThumbsUp className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes('safety') || n.includes('incident') || n.includes('concern')) {
      return {
        className: 'bg-red-950/60 text-red-400 border-red-800/60',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes('training') || n.includes('development')) {
      return {
        className: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
        icon: <GraduationCap className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes('performance') || n.includes('review')) {
      return {
        className: 'bg-blue-950/60 text-sky-400 border-blue-800/60',
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      };
    }
    if (n.includes('instruction') || n.includes('directive')) {
      return {
        className: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60',
        icon: <FileText className="w-3.5 h-3.5" />,
      };
    }
    return {
      className: 'bg-neutral-900 text-gray-300 border-neutral-700',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
    };
  };

  const handleAcknowledge = async (payload: AcknowledgeLogPayload) => {
    if (!logId) return;
    await acknowledgeMutation.mutateAsync({ id: logId, payload });
    setShowSuccessBanner(true);
    refetch();
  };

  const handleDownloadPdf = () => {
    if (!logId) return;
    window.open(`/api/v1/communication/logs/${logId}/download/`, '_blank');
  };

  const canAcknowledge = Boolean(
    (log?.can_acknowledge || log?.can_respond) && !log?.is_acknowledged
  );

  const defaultSignerName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased w-full">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black w-full">
        <ProfileSidebar activeTab="logs" />

        <main className="flex-1 min-w-0 bg-black px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading log details...</p>
            </div>
          ) : error || !log ? (
            <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-8 text-center space-y-4 max-w-lg mx-auto mt-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">Unable to Load Communication Log</h3>
              <p className="text-xs text-gray-300">
                {(error as any)?.response?.data?.detail ||
                  (error as any)?.message ||
                  'The requested log could not be found or permission was denied.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href="/communication/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Navigation & Actions */}
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/communication/dashboard"
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Log Dashboard</span>
                </Link>

                {log.can_download && (
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md cursor-pointer border border-neutral-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>

              {/* Success Notification Banner */}
              {showSuccessBanner && (
                <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Communication has been acknowledged successfully!</span>
                  </div>
                  <button
                    onClick={() => setShowSuccessBanner(false)}
                    className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Header Title */}
              <div>
                <h1 className="animate-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {log.subject}
                </h1>
              </div>

              {/* Main Log Card */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-6">
                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-neutral-800">
                  {log.log_type?.name && (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-md inline-flex items-center gap-1.5 border ${
                        getLogTypeBadge(log.log_type.name).className
                      }`}
                    >
                      {getLogTypeBadge(log.log_type.name).icon}
                      <span>{log.log_type.name}</span>
                    </span>
                  )}

                  {log.visibility === 'private' ? (
                    <span className="text-xs font-semibold px-3 py-1 bg-purple-950/60 text-purple-400 border border-purple-800/60 rounded-md inline-flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private Log</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-950/60 text-blue-400 border border-blue-800/60 rounded-md inline-flex items-center gap-1.5">
                      <span>{log.visibility_display || 'Shared with Employee'}</span>
                    </span>
                  )}

                  {log.is_acknowledged ? (
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-md inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 bg-amber-950/60 text-amber-400 border border-amber-800/60 rounded-md inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Acknowledgment Pending</span>
                    </span>
                  )}
                </div>

                {/* Participants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Created By</p>
                    <div className="flex items-center gap-3.5 bg-[#242424] p-4 rounded-xl border border-neutral-800">
                      <div className="bg-blue-500/15 text-blue-400 rounded-full p-3 shrink-0 border border-blue-500/20">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{log.created_by.full_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {log.created_by.job_title || log.created_by.role_display || log.created_by.role || 'Staff Manager'}
                        </p>
                        {log.created_by.department_title && (
                          <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1 truncate">
                            <Building className="w-3 h-3 shrink-0" />
                            <span>{log.created_by.department_title}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Recipient Employee</p>
                    <div className="flex items-center gap-3.5 bg-[#242424] p-4 rounded-xl border border-neutral-800">
                      <div className="bg-emerald-500/15 text-emerald-400 rounded-full p-3 shrink-0 border border-emerald-500/20">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{log.employee.full_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {log.employee.job_title || log.employee.role_display || log.employee.role || 'Staff Member'}
                        </p>
                        {log.employee.department_title && (
                          <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1 truncate">
                            <Building className="w-3 h-3 shrink-0" />
                            <span>{log.employee.department_title}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates & Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#242424] rounded-xl border border-neutral-800 text-xs">
                  <div>
                    <p className="text-gray-400 font-semibold mb-1">Event Date</p>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{formatLongDate(log.event_date)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold mb-1">Created</p>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{formatDateTime(log.created_at)}</span>
                    </p>
                  </div>
                  {log.acknowledgment_deadline && (
                    <div>
                      <p className="text-gray-400 font-semibold mb-1">Acknowledgment Deadline</p>
                      <p
                        className={`font-medium flex items-center gap-1.5 ${
                          log.deadline_overdue ? 'text-red-400 font-bold' : 'text-white'
                        }`}
                      >
                        <CalendarCheck className="w-4 h-4 shrink-0" />
                        <span>{formatLongDate(log.acknowledgment_deadline)}</span>
                        {log.deadline_overdue && <span className="text-red-500 text-[11px]">(Overdue)</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Log Description & Content */}
                <div>
                  <h3 className="text-white font-bold text-sm mb-2.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>Communication Notes & Details</span>
                  </h3>
                  <div className="bg-[#242424] border border-neutral-800 rounded-xl p-5 text-gray-300 text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {log.content}
                  </div>
                </div>

                {/* Creator Signature */}
                {log.creator_signature && (
                  <div className="border-t border-neutral-800 pt-6">
                    <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span>Creator Signature & Verification</span>
                    </h3>
                    <SignatureDisplay
                      signature={log.creator_signature}
                      signerName={log.created_by.full_name}
                      timestamp={log.creator_signature_timestamp}
                    />
                  </div>
                )}

                {/* Acknowledgment Action Button or Acknowledged Status */}
                {canAcknowledge ? (
                  <div className="border-t border-neutral-800 pt-6">
                    <button
                      onClick={() => setIsAcknowledgeModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-sm shadow-xl shadow-emerald-950/60"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Acknowledge This Communication</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Click to submit your digital sign-off and optional notes
                      {log.acknowledgment_deadline && ` (Deadline: ${formatLongDate(log.acknowledgment_deadline)})`}
                    </p>
                  </div>
                ) : log.is_acknowledged ? (
                  <div className="border-t border-neutral-800 pt-6">
                    <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Communication Acknowledged</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Acknowledged on {formatDateTime(log.acknowledged_at || log.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Acknowledgment Responses Thread */}
              {log.responses && log.responses.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Acknowledgment Responses ({log.responses.length})</span>
                  </h2>

                  <div className="space-y-4">
                    {log.responses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-[#242424] border border-neutral-800 rounded-xl p-5 space-y-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="bg-emerald-500/15 text-emerald-400 rounded-full p-2.5 shrink-0 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                              <p className="text-white font-bold text-sm">{response.responder.full_name}</p>
                              <span className="text-gray-400 text-xs">{formatDateTime(response.created_at)}</span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded">
                                {response.response_text === 'Acknowledged' || response.is_simple_acknowledgment
                                  ? 'Simple Acknowledgment'
                                  : 'With Notes'}
                              </span>
                            </div>

                            {/* Response Note */}
                            <div className="text-gray-300 text-xs leading-relaxed break-words bg-[#1a1a1a] p-3.5 rounded-lg border border-neutral-800">
                              {response.response_text === 'Acknowledged' || response.is_simple_acknowledgment ? (
                                <p className="italic text-gray-400">Acknowledgment confirmed by employee.</p>
                              ) : (
                                <p>{response.response_text}</p>
                              )}
                            </div>

                            {/* Responder Signature */}
                            {response.responder_signature && (
                              <div className="mt-3">
                                <SignatureDisplay
                                  signature={response.responder_signature}
                                  signerName={response.responder.full_name}
                                  timestamp={response.responder_signature_timestamp}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AcknowledgeModal
        isOpen={isAcknowledgeModalOpen}
        onClose={() => setIsAcknowledgeModalOpen(false)}
        onConfirm={handleAcknowledge}
        isLoading={acknowledgeMutation.isPending}
        defaultSignerName={defaultSignerName}
      />
    </div>
  );
};

export default LogDetailPage;
