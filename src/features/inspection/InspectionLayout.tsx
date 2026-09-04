import React from 'react';
import { Navbar } from '../../components/Navbar';
import { InspectionSidebar } from './InspectionSidebar';
import { useAuth } from '../../context/AuthContext';

interface InspectionLayoutProps {
  children: React.ReactNode;
}

export const InspectionLayout: React.FC<InspectionLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} notificationCount={25} />
      <div className="flex flex-1 min-h-[calc(100vh-80px)]">
        <InspectionSidebar />
        <main className="flex-1 bg-black overflow-y-auto" data-tour-main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default InspectionLayout;
