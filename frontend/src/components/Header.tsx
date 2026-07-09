import React from 'react';
import { Menu, User, Bell, Search } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface HeaderProps {
  onMenuClick?: () => void;
  userRole?: 'Customer' | 'Artisan' | 'Mediator';
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  userRole = 'Customer',
  userName = 'John Doe'
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <header className="header">
      <div className="header-left">
        {isMobile && (
          <button
            className="header-menu-button"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="header-brand">
          <div className="header-logo">
            <span>OW</span>
          </div>
          <div className="header-brand-text">
            <h1 className="header-title">OwoWork</h1>
            {!isMobile && (
              <p className="header-subtitle">Trusted Escrow Platform</p>
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="header-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search jobs, artisans, transactions..."
            className="header-search-input"
          />
        </div>
      )}

      <div className="header-right">
        <button className="header-icon-button" aria-label="Notifications">
          <Bell size={20} />
          <span className="header-notification-badge">3</span>
        </button>

        <div className="header-user-profile">
          <div className="header-user-avatar">
            <User size={20} />
          </div>
          <div className="header-user-info">
            <p className="header-user-name">{userName}</p>
            <p className="header-user-role">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};