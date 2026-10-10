import React from 'react';
import { useVisitorContext } from '../../context/VisitorContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  CheckSquare, 
  LogIn, 
  History, 
  BarChart3, 
  Settings, 
  Shield, 
  Building2, 
  LogOut, 
  X,
  Users
} from 'lucide-react';
import { ActivePage } from '../../types/visitor';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activePage, 
    setActivePage, 
    visitors, 
    currentUser, 
    logout,
    orgSettings 
  } = useVisitorContext();

  // Dynamic counts for menu badges
  const pendingCount = visitors.filter((v) => v.status === 'pending').length;
  const insideCount = visitors.filter((v) => v.status === 'inside').length;

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'registration',
      label: 'Visitor Registration',
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: 'approvals',
      label: 'Visitor Approval',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingCount,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'checkinout',
      label: 'Check-In / Out',
      icon: <LogIn className="w-4 h-4" />,
      badge: insideCount,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'records',
      label: 'Visitor Records',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Admin Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">PassGuard</span>
              <span className="text-[10px] text-blue-400 font-semibold block uppercase tracking-wider">
                VMS Portal
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Management
          </p>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Facility Info Card */}
        <div className="p-4 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="truncate">{orgSettings.buildingName}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
            <span>Occupancy On-Site:</span>
            <span className="font-mono font-bold text-emerald-400">{insideCount} visitors</span>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser.role} · {currentUser.department || 'Staff'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
