'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '../features/auth/LoginForm';
import { AuthBanner } from '../features/auth/AuthBanner';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white grid grid-cols-1 lg:grid-cols-2 font-sans antialiased">
      {/* Left Column: Form & Top Header */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/fire_house_logo.svg"
              alt="Firehouse Movers Seal"
              className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-white text-lg tracking-wider">FIREHOUSE</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <LoginForm />

        <div className="text-center lg:text-left text-xs text-gray-500">
          © {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Reusable Feature Banner */}
      <AuthBanner />
    </div>
  );
};

export default LoginPage;
