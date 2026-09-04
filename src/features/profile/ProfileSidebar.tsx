'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Users,
  Trophy,
  Building2,
  Target,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ProfileSidebarProps {
  activeTab?: string;
  onTabSelect?: (tabId: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabSelect,
}) => {
  const pathname = usePathname() || '';
  const { user } = useAuth();

  // Role check matching Django base_profile.html
  const roleName = (
    typeof user?.role === 'object' && user?.role !== null
      ? user.role.name || ''
      : typeof user?.role === 'string'
      ? user.role
      : ''
  ).toLowerCase();

  const isManager =
    roleName === 'manager' ||
    roleName === 'admin' ||
    roleName === 'ceo' ||
    roleName === 'vp' ||
    roleName === 'llc/owner' ||
    roleName === 'operations lead' ||
    Boolean(typeof user?.role === 'object' && user?.role !== null && (user.role.is_manager || user.role.is_admin || user.role.is_senior_management));

  const canSeeTeam = isManager;

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
    { id: 'people', label: 'People', icon: Users, path: '/people' },
    { id: 'awards', label: 'Current Awards', icon: Trophy, path: '/awards' },
    ...(canSeeTeam ? [{ id: 'team', label: 'Team', icon: Users, path: '/team' }] : []),
    { id: 'department', label: 'Department', icon: Building2, path: '/department' },
    ...(isManager
      ? [{ id: 'goals', label: 'Goals Management', icon: Target, path: '/goals' }]
      : [{ id: 'goals', label: 'My Goals', icon: Target, path: '/goals' }]),
    ...(isManager ? [{ id: 'my_goals', label: 'My Goals', icon: Target, path: '/goals?tab=my_goals' }] : []),
    { id: 'training', label: 'Resources & Training', icon: GraduationCap, path: '/resources-training' },
    { id: 'logs', label: 'Log Dashboard', icon: TrendingUp, path: '/communication/dashboard' },
  ];

  return (
    <aside
      className="w-64 bg-[#1a1a1a] text-white px-6 py-8 shrink-0 min-h-[calc(100vh-65px)] hidden md:block border-r border-[#262626]"
      data-tour-sidebar
    >
      <nav className="space-y-3 font-medium text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab
            ? activeTab === item.id || (activeTab === 'goals' && item.id === 'goals')
            : pathname === item.path || (item.path.startsWith('/goals') && pathname === '/goals');

          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => onTabSelect && onTabSelect(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-red-500 text-white font-semibold shadow-lg shadow-red-500/20'
                  : 'text-gray-300 hover:bg-red-500/80 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
