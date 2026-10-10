import React, { useState, useEffect } from 'react';
import { useVisitorContext } from '../../context/VisitorContext';
import { 
  Bell, 
  Search, 
  QrCode, 
  UserPlus, 
  LogOut, 
  CheckCheck, 
  Menu, 
  Clock, 
  Shield, 
  ChevronDown,
  User,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../../types/visitor';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentUser, 
    activePage, 
    setActivePage, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications,
    switchRole, 
    logout,
    setScannerModalOpen,
    setSelectedVisitor,
    visitors
  } = useVisitorContext();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof visitors>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live quick search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = visitors.filter(
      (v) =>
        v.fullName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 5));
    setShowSearchDropdown(true);
  }, [searchQuery, visitors]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Command Dashboard';
      case 'registration': return 'Visitor Registration';
      case 'approvals': return 'Host Approval Queue';
      case 'checkinout': return 'Reception Check-In / Out';
      case 'records': return 'Visitor Directory & Logs';
      case 'reports': return 'Reports & Analytics';
      case 'settings': return 'System Settings';
      default: return 'Visitor Management';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 gap-4">
        {/* Left Section: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>PassGuard VMS</span>
              <span aria-hidden="true">/</span>
              <span className="text-slate-800 font-medium">{getPageTitle()}</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center: Global Visitor Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search visitor, badge #, company, or pass ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Visitors ({searchResults.length})
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVisitor(v);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 text-left hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{v.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        {v.company} · Host: {v.hostName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] font-bold text-blue-600 block">
                        {v.id}
                      </span>
                      <span className="text-[10px] capitalize text-slate-500">
                        {v.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Station Time */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime}</span>
          </div>

          {/* Quick Scanner Action */}
          <button
            onClick={() => setScannerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Scan Pass Barcode/QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Scan Pass</span>
          </button>

          {/* Quick Register Action */}
          <button
            onClick={() => setActivePage('registration')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Visitor</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-slate-500 capitalize leading-tight">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile & Role Switcher Popover */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <p className="text-[10px] font-semibold text-blue-700 mt-1 uppercase tracking-wider">
                    {currentUser.title}
                  </p>
                </div>

                <div className="p-2 border-b border-slate-100">
                  <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Role
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        switchRole('admin');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        currentUser.role === 'admin'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Admin (Full Access)</span>
                      {currentUser.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('receptionist');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        currentUser.role === 'receptionist'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Reception Desk Staff</span>
                      {currentUser.role === 'receptionist' && <Shield className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('host');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        currentUser.role === 'host'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Employee / Host View</span>
                      {currentUser.role === 'host' && <Shield className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
