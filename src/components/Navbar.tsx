'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { NavBrand } from './navbar/NavBrand';
import { NavLinks } from './navbar/NavLinks';
import { UserProfilePill } from './navbar/UserProfilePill';
import { MobileNavDrawer } from './navbar/MobileNavDrawer';
import { useAuth } from '../context/AuthContext';
import type { AuthUser } from '../api/types';

export interface UserProfile {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  role?: string | { name?: string; [key: string]: unknown };
  avatarUrl?: string;
  profile_picture?: string | null;
}

export type NavbarUser = AuthUser | UserProfile | null;

export interface NavbarProps {
  isAuthenticated?: boolean;
  user?: NavbarUser;
  onLogout?: () => void | Promise<void>;
  notificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated: propIsAuthenticated,
  user: propUser,
  onLogout,
  notificationCount = 0,
}) => {
  const { isAuthenticated: authIsAuthenticated, user: authUser, logout: authLogout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuth = propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated;
  const currentUser = propUser !== undefined ? propUser : authUser;

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await authLogout();
        router.push('/login');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 min-h-[72px] flex items-center justify-between shadow-2xl transition-all">
      {/* Subtle Bottom Accent Gradient Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none"></div>

      {/* Brand Identity */}
      <NavBrand />

      {/* Authenticated Staff Links */}
      {isAuth && <NavLinks notificationCount={notificationCount} />}

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {isAuth ? (
          <>
            <UserProfilePill user={currentUser} onLogout={handleLogout} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Phone Quick Call */}
            <a
              href="tel:9725399588"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>(972) 539-9588</span>
            </a>

            {/* Instant Quote CTA */}
            <Link
              href="/landing#estimate-calculator"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] xs:text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-200 hover:text-white rounded-xl shadow-md transition-all inline-block cursor-pointer shrink-0"
            >
              Portal Login
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer (Works for both guest and authenticated states) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bg-black/95 backdrop-blur-2xl border-b border-neutral-800 p-6 space-y-4 shadow-2xl z-50">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-gray-300">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              About Firehouse
            </Link>
            <Link
              href="/landing#fleet-3d"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              3D Fleet Inspection
            </Link>
            <Link
              href="/journey"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              Move Lifecycle Journey
            </Link>
            <Link
              href="/landing#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              Services Directory
            </Link>
            <Link
              href="/landing#estimate-calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white"
            >
              Instant Move Pricing
            </Link>
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
            <a
              href="tel:9725399588"
              className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-center text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <span>Call (972) 539-9588</span>
            </a>
            <Link
              href="/landing#estimate-calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-center text-xs shadow-lg shadow-red-600/30"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
