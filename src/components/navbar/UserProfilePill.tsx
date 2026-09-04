import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import type { NavbarUser } from '../Navbar';
import { getMediaUrl } from '../../utils/media';

interface UserProfilePillProps {
  user: NavbarUser;
  onLogout?: () => void | Promise<void>;
}

export const UserProfilePill: React.FC<UserProfilePillProps> = ({ user, onLogout }) => {
  const displayName = user ? (user.first_name || (user as any).firstName || 'User') : 'User';
  const roleName = user
    ? typeof user.role === 'object' && user.role !== null
      ? user.role.name || (user.role.is_customer ? 'Customer' : 'Member')
      : user.role || 'Member'
    : 'Member';
  const rawAvatar = user?.profile_picture || (user as any)?.avatarUrl;
  const avatarSrc = getMediaUrl(rawAvatar);

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        title="View Profile"
        className="hidden sm:flex items-center gap-3 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full border border-white/10 transition-all duration-200 hover:border-red-500/40 shadow-sm cursor-pointer group"
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
          className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-red-500/50 transition-colors"
        />
        <div className="text-left leading-tight pr-1">
          <p className="text-xs font-semibold text-white truncate max-w-[100px] group-hover:text-red-400 transition-colors">
            {displayName}
          </p>
          <p className="text-[10px] text-gray-300 capitalize truncate max-w-[100px]">
            {roleName}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onLogout) {
            onLogout();
          }
        }}
        title="Logout"
        aria-label="Logout"
        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default UserProfilePill;
