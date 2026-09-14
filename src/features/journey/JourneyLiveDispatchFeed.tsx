'use client';

import React, { useEffect, useRef } from 'react';
import {
  Radio,
  ShieldCheck,
  Truck,
  Building2,
  PackageCheck,
  CheckCircle2,
  Navigation,
  Check,
  CheckCheck,
} from 'lucide-react';

export interface DispatchMessage {
  id: number;
  stageId: number;
  sender: string;
  senderRole: string;
  avatarType: 'station' | 'load' | 'transit' | 'dest' | 'delivered';
  /** Which side of the thread this message renders on, like a real two-way chat. */
  side: 'hq' | 'field';
  timestamp: string;
  text: string;
  tag: string;
}

export const DISPATCH_MESSAGES: DispatchMessage[] = [
  {
    id: 1,
    stageId: 1,
    sender: 'HQ Dispatch',
    senderRole: 'Central Operations',
    avatarType: 'station',
    side: 'hq',
    timestamp: '07:30 AM',
    text: "Crew's rolling — departed Station 1, headed to Frisco.",
    tag: 'Dispatched',
  },
  {
    id: 2,
    stageId: 2,
    sender: 'Frisco Crew Lead',
    senderRole: 'On-Site Operations',
    avatarType: 'load',
    side: 'field',
    timestamp: '09:45 AM',
    text: 'Loaded and E-track secured. Rolling out.',
    tag: 'Loaded',
  },
  {
    id: 3,
    stageId: 3,
    sender: 'Telematics Control',
    senderRole: 'Fleet Monitoring',
    avatarType: 'transit',
    side: 'field',
    timestamp: '11:15 AM',
    text: 'On TX-121, GPS locked, air-ride active.',
    tag: 'In Transit',
  },
  {
    id: 4,
    stageId: 4,
    sender: 'Plano Unload Crew',
    senderRole: 'Destination Lead',
    avatarType: 'dest',
    side: 'field',
    timestamp: '01:30 PM',
    text: 'On-site in Plano. Placement underway.',
    tag: 'Arrived',
  },
  {
    id: 5,
    stageId: 5,
    sender: 'HQ Dispatch',
    senderRole: 'Customer Care',
    avatarType: 'delivered',
    side: 'hq',
    timestamp: '03:15 PM',
    text: 'Walkthrough signed. Move complete — welcome home.',
    tag: 'Delivered',
  },
];

const TAG_COLOR: Record<string, string> = {
  Dispatched: 'text-red-400',
  Loaded: 'text-orange-400',
  'In Transit': 'text-amber-400',
  Arrived: 'text-sky-400',
  Delivered: 'text-emerald-400',
};

const TAG_DOT: Record<string, string> = {
  Dispatched: 'bg-red-400',
  Loaded: 'bg-orange-400',
  'In Transit': 'bg-amber-400',
  Arrived: 'bg-sky-400',
  Delivered: 'bg-emerald-400',
};

interface JourneyLiveDispatchFeedProps {
  visibleCount: number;
  isTyping: boolean;
  typingText?: string;
  activeStageIndex: number;
  className?: string;
}

export const JourneyLiveDispatchFeed: React.FC<JourneyLiveDispatchFeedProps> = ({
  visibleCount,
  isTyping,
  typingText = 'typing...',
  activeStageIndex,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const visibleMessages = DISPATCH_MESSAGES.slice(0, Math.max(1, visibleCount));

  // Auto scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [visibleCount, isTyping]);

  const renderAvatar = (type: DispatchMessage['avatarType']) => {
    switch (type) {
      case 'station':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'load':
        return <PackageCheck className="w-3.5 h-3.5" />;
      case 'transit':
        return <Truck className="w-3.5 h-3.5" />;
      case 'dest':
        return <Navigation className="w-3.5 h-3.5" />;
      case 'delivered':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      default:
        return <Radio className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={`w-full lg:w-[30%] bg-[#0c0c0e] border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden self-stretch h-full min-h-[380px] sm:min-h-[430px] ${className}`}
    >
      {/* Faint ambient wash so the panel doesn't read as flat black */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-red-600/[0.06] rounded-full blur-3xl" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
            Live Dispatch Feed
          </h4>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/[0.08] text-[10px] font-mono text-gray-300">
          <Radio className="w-3 h-3 text-red-500" />
          <span>Real-Time</span>
        </div>
      </div>

      {/* Chat thread — two-sided, like a real conversation between HQ and the field crew */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 h-[250px] max-h-[250px] relative z-10 scrollbar-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_16px,black_100%)] pt-1"
      >
        {visibleMessages.map((msg, index) => {
          const isLatest = index === visibleMessages.length - 1 && !isTyping;
          const isHq = msg.side === 'hq';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 transition-opacity duration-300 ${
                isHq ? 'flex-row-reverse' : 'flex-row'
              } ${isLatest ? 'opacity-100' : 'opacity-75'}`}
            >
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mb-4 ${
                  isHq
                    ? 'border-red-500/50 bg-red-950/40 text-red-400'
                    : 'border-white/15 bg-white/[0.04] text-gray-300'
                }`}
              >
                {renderAvatar(msg.avatarType)}
              </div>

              <div className={`min-w-0 max-w-[82%] flex flex-col ${isHq ? 'items-end' : 'items-start'}`}>
                <div
                  className={`flex items-baseline gap-1.5 px-1 ${isHq ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <span className="text-[10.5px] font-bold text-white leading-tight truncate">
                    {isHq ? 'You (HQ)' : msg.sender}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 shrink-0">{msg.timestamp}</span>
                </div>

                <div
                  className={`mt-1 inline-block px-3 py-2 border transition-colors duration-300 ${
                    isHq
                      ? `rounded-2xl rounded-tr-sm ${
                          isLatest
                            ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-400/60 shadow-[0_6px_18px_-6px_rgba(239,68,68,0.55)]'
                            : 'bg-gradient-to-br from-red-600/80 to-red-700/80 border-red-500/30'
                        }`
                      : `rounded-2xl rounded-tl-sm ${
                          isLatest
                            ? 'bg-[#1a1a1d] border-white/[0.12] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'
                            : 'bg-[#161618] border-white/[0.06]'
                        }`
                  }`}
                >
                  <p className={`text-[12px] leading-snug ${isHq ? 'text-white' : 'text-gray-200'}`}>
                    {msg.text}
                  </p>
                </div>

                <div className={`mt-1 flex items-center gap-1.5 px-1 ${isHq ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${TAG_DOT[msg.tag] ?? 'bg-gray-500'}`} />
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                      TAG_COLOR[msg.tag] ?? 'text-gray-500'
                    }`}
                  >
                    {msg.tag}
                  </span>
                  {isHq && isLatest && (
                    <CheckCheck className="w-3 h-3 text-sky-400" strokeWidth={2.5} />
                  )}
                  {isHq && !isLatest && (
                    <Check className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator — always the field side, since HQ is the one waiting on updates */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full border border-white/15 bg-white/[0.04] text-gray-300 flex items-center justify-center shrink-0 mb-4">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="px-1 text-[9px] font-mono text-gray-500">{typingText}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#161618] border border-white/[0.06] px-3.5 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Dispatch Channel Security Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Order Channel</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-red-500">
          Stage {activeStageIndex + 1} / 5
        </span>
      </div>
    </div>
  );
};
