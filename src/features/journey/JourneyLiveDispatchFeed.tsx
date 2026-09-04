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
} from 'lucide-react';

export interface DispatchMessage {
  id: number;
  stageId: number;
  sender: string;
  senderRole: string;
  avatarType: 'station' | 'load' | 'transit' | 'dest' | 'delivered';
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
    timestamp: '03:15 PM',
    text: 'Walkthrough signed. Move complete — welcome home.',
    tag: 'Delivered',
  },
];

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
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleCount, isTyping]);

  const renderAvatar = (type: DispatchMessage['avatarType']) => {
    switch (type) {
      case 'station':
        return <Building2 className="w-3.5 h-3.5 text-red-400" />;
      case 'load':
        return <PackageCheck className="w-3.5 h-3.5 text-orange-400" />;
      case 'transit':
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      case 'dest':
        return <Navigation className="w-3.5 h-3.5 text-sky-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div className={`w-full lg:w-[30%] bg-[#0d0d0f] border border-white/[0.08] rounded-3xl p-4 sm:p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden self-stretch h-full min-h-[380px] sm:min-h-[430px] ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
            Live Dispatch Feed
          </h4>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/[0.08] text-[10px] font-mono text-gray-300">
          <Radio className="w-3 h-3 text-red-500" />
          <span>Real-Time</span>
        </div>
      </div>

      {/* Chat thread */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3.5 my-2 pr-1 h-[250px] max-h-[250px] relative z-10 scrollbar-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_16px,black_100%)] pt-1"
      >
        {visibleMessages.map((msg, index) => {
          const isLatest = index === visibleMessages.length - 1 && !isTyping;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 transition-opacity duration-300 ${
                isLatest ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <div className="w-6 h-6 rounded-full border border-red-500/50 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0 mt-3.5">
                {renderAvatar(msg.avatarType)}
              </div>

              <div className="min-w-0 max-w-[85%]">
                <div className="flex items-baseline gap-2 px-1">
                  <span className="text-[10.5px] font-bold text-white leading-tight truncate">
                    {msg.sender}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 shrink-0">{msg.timestamp}</span>
                </div>

                <div
                  className={`mt-1 inline-block rounded-2xl rounded-tl-sm px-3 py-2 border transition-colors duration-300 ${
                    isLatest
                      ? 'bg-[#181113] border-red-500/30 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]'
                      : 'bg-[#161618] border-white/[0.06]'
                  }`}
                >
                  <p className="text-[12px] text-gray-200 leading-snug">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator, styled as a normal chat bubble */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full border border-red-500/50 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0 mt-3.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="px-1 text-[9px] font-mono text-red-400/80">{typingText}</div>
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
