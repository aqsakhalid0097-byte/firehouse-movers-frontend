'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMediaUrl } from '../../utils/media';

export interface CustomerNavbarProps {
  notificationCount?: number;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  notificationCount = 0,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.first_name || 'Customer';
  const avatarSrc = getMediaUrl(user?.profile_picture);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#1a1a1a] via-[#141414] to-[#0f0f0f] border-b border-gray-800 backdrop-blur-md px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <Link href="/customer" className="flex items-center gap-3.5 group">
          <div className="relative">
            <img
              src="/images/fire_house_logo.svg"
              alt="Firehouse Movers Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-wider font-serif text-white">
            FIREHOUSE MOVERS
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/customer"
            className="text-gray-300 hover:text-red-500 transition-colors font-medium relative py-1"
          >
            Home
          </Link>
          <a
            href="#request-quote"
            className="text-gray-300 hover:text-red-500 transition-colors font-medium relative py-1"
          >
            Get Quote
          </a>
          <a
            href="#history"
            className="text-gray-300 hover:text-red-500 transition-colors font-medium relative py-1"
          >
            History
          </a>

          {/* Notifications Button */}
          <button
            type="button"
            aria-label="View notifications"
            className="text-gray-300 hover:text-red-500 transition-colors relative p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <Link
            href="/profile"
            title="View Profile"
            className="flex items-center bg-white/10 px-3.5 py-1.5 rounded-full shadow-md hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 border border-white/10 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-neutral-900">
              <img
                src={avatarSrc}
                alt={displayName}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/user_icon.jpg')) {
                    target.src = '/images/user_icon.jpg';
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2.5 text-left leading-tight pr-1">
              <p className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors truncate max-w-[100px]">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-300">Customer</p>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[#1a1a1a] border-b border-gray-800 p-5 space-y-4 shadow-2xl z-40 animate-in slide-in-from-top duration-200">
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 pb-3 border-b border-gray-800"
          >
            <img
              src={avatarSrc}
              alt={displayName}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/user_icon.jpg')) {
                  target.src = '/images/user_icon.jpg';
                }
              }}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div>
              <p className="text-sm font-bold text-white">{displayName}</p>
              <p className="text-xs text-gray-400">Customer Portal</p>
            </div>
          </Link>

          <div className="flex flex-col space-y-3 text-sm font-medium text-gray-200">
            <Link
              href="/customer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-red-500 transition-colors"
            >
              Home
            </Link>
            <a
              href="#request-quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-red-500 transition-colors"
            >
              Get Quote
            </a>
            <a
              href="#history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-red-500 transition-colors"
            >
              History
            </a>
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-red-500 transition-colors"
            >
              My Profile
            </Link>
          </div>

          <button
            type="button"
            onClick={async () => {
              setIsMobileMenuOpen(false);
              await handleLogout();
            }}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
