import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import type { NavbarUser } from '../Navbar';
import { getMediaUrl } from '../../utils/media';

interface MobileNavDrawerProps {
  user: NavbarUser;
  onClose: () => void;
  onLogout?: () => void | Promise<void>;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ user, onClose, onLogout }) => {
  const displayName = user ? (user.first_name || (user as any).firstName || 'User') : 'User';
  const roleName = user
    ? typeof user.role === 'object' && user.role !== null
      ? user.role.name || (user.role.is_customer ? 'Customer' : 'Member')
      : user.role || 'Member'
    : 'Member';
  const rawAvatar = user?.profile_picture || (user as any)?.avatarUrl;
  const avatarSrc = getMediaUrl(rawAvatar);

  return (
    <div className="md:hidden fixed inset-x-0 top-full bg-[#1a1a1a] border-b border-gray-800 p-5 space-y-4 shadow-2xl z-40 animate-in slide-in-from-top duration-200">
      <Link
        href="/profile"
        onClick={onClose}
        className="flex items-center gap-3 pb-3 border-b border-gray-800 hover:opacity-80 transition-opacity cursor-pointer group"
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
          className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-red-500/50 transition-colors"
        />
        <div>
          <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{displayName}</p>
          <p className="text-xs text-gray-400 capitalize">{roleName}</p>
        </div>
      </Link>

      <div className="flex flex-col space-y-2 text-sm font-semibold tracking-wider text-gray-200 uppercase">
        <Link href="/vehicle/vehicle-availability/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          AVAILABILITY & LOGISTICS
        </Link>
        <Link href="/station/report/1/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          STATIONS
        </Link>
        <Link href="/truck-inspection/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          VEHICLE INSPECTION
        </Link>
        <Link href="/onsite-inspection/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          ON-SITE INSPECTION
        </Link>
        <Link href="/inventory/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          INVENTORY
        </Link>
        <Link href="/awards/gifts/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          GIFT
        </Link>
        <Link href="/packaging/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          PACKAGING
        </Link>
        <Link href="/dispatch/" onClick={onClose} className="hover:text-red-400 py-1 transition-colors">
          DISPATCH
        </Link>
      </div>

      <button
        type="button"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          if (onLogout) {
            await onLogout();
          }
        }}
        className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

export default MobileNavDrawer;
