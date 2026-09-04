'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Truck,
  Users,
  Boxes,
  FileText,
  ShieldCheck,
  BarChart3,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  user?: {
    username: string;
    role?: string;
  };
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dispatch Console', path: '/dispatch', icon: Truck, badge: 'Live' },
    { label: 'People Directory', path: '/people', icon: Users },
    { label: 'Inventory & Supplies', path: '/inventory', icon: Boxes },
    { label: 'Quotes & Orders', path: '/quotes', icon: FileText },
    { label: 'Fleet & Inspections', path: '/fleet', icon: ShieldCheck },
    { label: 'Performance & Goals', path: '/goals', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <img src="/images/fire_house_logo.svg" alt="Firehouse Movers Seal" className="w-10 h-10 object-contain drop-shadow-md" />
          <div>
            <h1 className="font-bold text-white tracking-wide text-base leading-none">
              FIREHOUSE
            </h1>
            <span className="text-[10px] font-semibold tracking-widest text-red-500 uppercase">
              Movers Portal
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600/20 to-orange-600/10 text-white border border-red-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-red-400">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'FH'}
            </div>
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                {user?.username || 'Staff User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                {user?.role || 'Operations'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
