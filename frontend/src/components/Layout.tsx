import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useBreakpoint } from '../hooks/useBreakpoint';

type UserRole = 'Customer' | 'Artisan' | 'Mediator';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  activeNavItem?: string;
  onNavigate?: (item: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  userRole = 'Customer',
  userName = 'John Doe',
  activeNavItem = 'dashboard',
  onNavigate
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {isMobile && (
        <Header
          onMenuClick={handleMenuClick}
          userRole={userRole}
          userName={userName}
        />
      )}

      <div className="layout-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          userRole={userRole}
          activeItem={activeNavItem}
          onNavigate={(item) => {
            onNavigate?.(item);
            if (isMobile) {
              setSidebarOpen(false);
            }
          }}
        />

        <main className="layout-main">
          {!isMobile && (
            <Header
              userRole={userRole}
              userName={userName}
            />
          )}
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>

      {isMobile && sidebarOpen && (
        <div className="mobile-sidebar-backdrop" onClick={handleCloseSidebar} />
      )}
    </div>
  );
};