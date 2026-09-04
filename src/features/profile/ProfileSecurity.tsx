import React from 'react';
import { ShieldCheck, Key, Mail } from 'lucide-react';

interface ProfileSecurityProps {
  email: string;
}

export const ProfileSecurity: React.FC<ProfileSecurityProps> = ({ email }) => {
  return (
    <section id="security" className="bg-[#262626] p-6 sm:p-8 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-red-500">Security Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center text-red-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Change Password</h4>
              <p className="text-xs text-gray-400">Update your password for enhanced account security</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer">
            Change Password
          </button>
        </div>

        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333333]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center text-red-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-white">Email Address</h4>
              <p className="text-sm font-medium text-gray-200 mt-0.5">{email}</p>
              <p className="text-xs text-gray-400 mt-1">This email is used for account notifications and password recovery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
