import React from 'react';
import {
  BriefcaseBusiness,
  UsersRound,
  CircleDollarSign,
  Gavel,
  Home,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

type UserRole = 'Customer' | 'Artisan' | 'Mediator';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: UserRole;
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    roles: ['Customer', 'Artisan', 'Mediator']
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: BriefcaseBusiness,
    roles: ['Customer', 'Artisan', 'Mediator']
  },
  {
    id: 'artisans',
    label: 'Artisans',
    icon: UsersRound,
    roles: ['Customer', 'Mediator']
  },
  {
    id: 'settlements',
    label: 'Settlements',
    icon: CircleDollarSign,
    roles: ['Customer', 'Artisan', 'Mediator']
  },
  {
    id: 'disputes',
    label: 'Disputes',
    icon: Gavel,
    roles: ['Customer', 'Artisan', 'Mediator']
  }
];

const bottomItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    roles: ['Customer', 'Artisan', 'Mediator']
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
    roles: ['Customer', 'Artisan', 'Mediator']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  userRole = 'Customer',
  activeItem = 'dashboard',
  onNavigate
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes(userRole)
  );

  const filteredBottomItems = bottomItems.filter(item =>
    item.roles.includes(userRole)
  );

  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      <aside className={`sidebar ${isMobile && isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <span>OW</span>
            </div>
            {!isMobile && (
              <div className="sidebar-brand-text">
                <h2 className="sidebar-title">OwoWork</h2>
                <p className="sidebar-subtitle">{userRole} Portal</p>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              className="sidebar-close-button"
              onClick={onClose}
              aria-label="Close menu"
            >
              ×
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="sidebar-nav-section">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} />
                  {!isMobile && <span>{item.label}</span>}
                  {isActive && <span className="sidebar-active-indicator" />}
                </button>
              );
            })}
          </div>

          <div className="sidebar-nav-section sidebar-nav-section-bottom">
            {filteredBottomItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className="sidebar-nav-item"
                  onClick={() => handleItemClick(item.id)}
                >
                  <Icon size={20} />
                  {!isMobile && <span>{item.label}</span>}
                </button>
              );
            })}
            <button
              className="sidebar-nav-item sidebar-nav-item-logout"
              onClick={() => handleItemClick('logout')}
            >
              <LogOut size={20} />
              {!isMobile && <span>Logout</span>}
            </button>
          </div>
        </nav>

        {!isMobile && (
          <div className="sidebar-footer">
            <div className="sidebar-role-badge">
              <span className="sidebar-role-indicator" />
              <span>{userRole}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};