import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VisitorRecord, 
  Host, 
  CurrentUser, 
  OrgSettings, 
  NotificationItem, 
  ActivePage, 
  UserRole 
} from '../types/visitor';
import { 
  INITIAL_VISITORS, 
  INITIAL_HOSTS, 
  DEMO_USERS, 
  DEFAULT_ORG_SETTINGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface ToastState {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface VisitorContextType {
  visitors: VisitorRecord[];
  hosts: Host[];
  currentUser: CurrentUser;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  notifications: NotificationItem[];
  orgSettings: OrgSettings;
  selectedVisitor: VisitorRecord | null;
  setSelectedVisitor: (v: VisitorRecord | null) => void;
  passModalVisitor: VisitorRecord | null;
  setPassModalVisitor: (v: VisitorRecord | null) => void;
  scannerModalOpen: boolean;
  setScannerModalOpen: (open: boolean) => void;
  toasts: ToastState[];
  showToast: (text: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Visitor actions
  registerVisitor: (data: Omit<VisitorRecord, 'id' | 'createdAt' | 'status' | 'qrCode'>, immediateCheckIn?: boolean) => VisitorRecord;
  checkInVisitor: (id: string, badgeNumber?: string) => boolean;
  checkOutVisitor: (id: string) => boolean;
  approveVisitor: (id: string, notes?: string) => boolean;
  rejectVisitor: (id: string, reason: string) => boolean;
  deleteVisitorRecord: (id: string) => boolean;
  
  // Host & Settings actions
  addHost: (host: Omit<Host, 'id'>) => void;
  toggleHostStatus: (id: string) => void;
  updateOrgSettings: (newSettings: Partial<OrgSettings>) => void;
  
  // Auth & Roles
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // Reset
  resetToSampleData: () => void;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence via localStorage with fallbacks
  const [visitors, setVisitors] = useState<VisitorRecord[]>(() => {
    try {
      const saved = localStorage.getItem('passguard_visitors');
      return saved ? JSON.parse(saved) : INITIAL_VISITORS;
    } catch {
      return INITIAL_VISITORS;
    }
  });

  const [hosts, setHosts] = useState<Host[]>(() => {
    try {
      const saved = localStorage.getItem('passguard_hosts');
      return saved ? JSON.parse(saved) : INITIAL_HOSTS;
    } catch {
      return INITIAL_HOSTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem('passguard_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.receptionist;
    } catch {
      return DEMO_USERS.receptionist;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('passguard_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [orgSettings, setOrgSettings] = useState<OrgSettings>(() => {
    try {
      const saved = localStorage.getItem('passguard_settings');
      return saved ? JSON.parse(saved) : DEFAULT_ORG_SETTINGS;
    } catch {
      return DEFAULT_ORG_SETTINGS;
    }
  });

  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);
  const [passModalVisitor, setPassModalVisitor] = useState<VisitorRecord | null>(null);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('passguard_visitors', JSON.stringify(visitors));
    } catch (e) {
      console.error(e);
    }
  }, [visitors]);

  useEffect(() => {
    try {
      localStorage.setItem('passguard_hosts', JSON.stringify(hosts));
    } catch (e) {
      console.error(e);
    }
  }, [hosts]);

  useEffect(() => {
    try {
      localStorage.setItem('passguard_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('passguard_notifs', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('passguard_settings', JSON.stringify(orgSettings));
    } catch (e) {
      console.error(e);
    }
  }, [orgSettings]);

  // Toast helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  const formatNowTime = () => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}`;
  };

  // Register visitor
  const registerVisitor = (
    data: Omit<VisitorRecord, 'id' | 'createdAt' | 'status' | 'qrCode'>, 
    immediateCheckIn = false
  ): VisitorRecord => {
    const nextSeq = Math.floor(1000 + Math.random() * 9000);
    const passId = `VP-${nextSeq}`;
    const nowStamp = formatNowTime();

    // If immediate check-in is selected (e.g. at front desk)
    const initialStatus = immediateCheckIn 
      ? 'inside' 
      : (orgSettings.requireApproval ? 'pending' : 'expected');

    const badgeNum = immediateCheckIn ? `#B-${Math.floor(100 + Math.random() * 899)}` : undefined;

    const newVisitor: VisitorRecord = {
      ...data,
      id: passId,
      status: initialStatus,
      checkInTime: immediateCheckIn ? nowStamp : undefined,
      badgeNumber: badgeNum,
      createdAt: nowStamp,
      qrCode: `PASS:${passId}:${data.fullName.toUpperCase().replace(/\s+/g, '_')}:HOST_${data.hostName.toUpperCase().replace(/\s+/g, '_')}`,
    };

    setVisitors((prev) => [newVisitor, ...prev]);

    // Dispatch notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: immediateCheckIn ? 'Walk-in Visitor Checked In' : 'New Visitor Registration',
      message: `${data.fullName} (${data.company || 'Guest'}) registered for ${data.hostName} · ${data.purpose}`,
      timestamp: 'Just now',
      read: false,
      type: immediateCheckIn ? 'visitor_checked_in' : 'approval_request',
      visitorId: passId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      immediateCheckIn 
        ? `${data.fullName} registered & checked in with badge ${badgeNum}!`
        : `Visitor pass ${passId} created successfully for ${data.fullName}!`,
      'success'
    );

    return newVisitor;
  };

  // Check In
  const checkInVisitor = (id: string, customBadge?: string): boolean => {
    const target = visitors.find((v) => v.id === id);
    if (!target) return false;

    const nowStamp = formatNowTime();
    const assignedBadge = customBadge || target.badgeNumber || `#B-${Math.floor(100 + Math.random() * 899)}`;

    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'inside',
            checkInTime: nowStamp,
            badgeNumber: assignedBadge,
          };
        }
        return v;
      })
    );

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Visitor Checked In',
      message: `${target.fullName} has checked in at reception for ${target.hostName}. Assigned badge ${assignedBadge}.`,
      timestamp: 'Just now',
      read: false,
      type: 'visitor_checked_in',
      visitorId: id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Checked in ${target.fullName}. Badge ${assignedBadge} assigned.`, 'success');
    return true;
  };

  // Check Out
  const checkOutVisitor = (id: string): boolean => {
    const target = visitors.find((v) => v.id === id);
    if (!target) return false;

    const nowStamp = formatNowTime();
    
    // Calculate stay duration
    let stayDuration = '1 hr 15 min';
    if (target.checkInTime) {
      try {
        const inDate = new Date(target.checkInTime.replace(' ', 'T'));
        const outDate = new Date();
        const diffMs = Math.max(0, outDate.getTime() - inDate.getTime());
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        stayDuration = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
      } catch {
        stayDuration = '45 min';
      }
    }

    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'completed',
            checkOutTime: nowStamp,
            stayDuration: stayDuration,
          };
        }
        return v;
      })
    );

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Visitor Checked Out',
      message: `${target.fullName} checked out. Badge ${target.badgeNumber || 'returned'} surrendered. Total visit: ${stayDuration}.`,
      timestamp: 'Just now',
      read: false,
      type: 'visitor_checked_out',
      visitorId: id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Checked out ${target.fullName}. Stay duration: ${stayDuration}`, 'info');
    return true;
  };

  // Approve visitor
  const approveVisitor = (id: string, notes = 'Visit approved by host.'): boolean => {
    const target = visitors.find((v) => v.id === id);
    if (!target) return false;

    const nowStamp = formatNowTime();

    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'expected',
            approvalNotes: notes,
            approvedBy: currentUser.name,
            approvedAt: nowStamp,
          };
        }
        return v;
      })
    );

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Visit Request Approved',
      message: `Pass for ${target.fullName} (${target.company}) was approved by ${currentUser.name}.`,
      timestamp: 'Just now',
      read: false,
      type: 'approved',
      visitorId: id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Visit request for ${target.fullName} approved!`, 'success');
    return true;
  };

  // Reject visitor
  const rejectVisitor = (id: string, reason: string): boolean => {
    const target = visitors.find((v) => v.id === id);
    if (!target) return false;

    const nowStamp = formatNowTime();

    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'rejected',
            rejectionReason: reason || 'Declined by host/administrator.',
            approvedBy: currentUser.name,
            approvedAt: nowStamp,
          };
        }
        return v;
      })
    );

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Visit Request Rejected',
      message: `Visit for ${target.fullName} was rejected. Reason: "${reason || 'Declined'}"`,
      timestamp: 'Just now',
      read: false,
      type: 'rejected',
      visitorId: id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Visit request for ${target.fullName} rejected.`, 'warning');
    return true;
  };

  const deleteVisitorRecord = (id: string): boolean => {
    setVisitors((prev) => prev.filter((v) => v.id !== id));
    showToast(`Record ${id} removed.`, 'info');
    return true;
  };

  // Add Host
  const addHost = (newHostData: Omit<Host, 'id'>) => {
    const id = `host-${Date.now()}`;
    const newHost: Host = {
      ...newHostData,
      id,
    };
    setHosts((prev) => [...prev, newHost]);
    showToast(`Added ${newHost.name} to host directory.`, 'success');
  };

  const toggleHostStatus = (id: string) => {
    setHosts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, active: !h.active } : h))
    );
  };

  const updateOrgSettings = (newSettings: Partial<OrgSettings>) => {
    setOrgSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Organization settings updated successfully.', 'success');
  };

  // Switch role helper
  const switchRole = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      showToast(`Switched active view to ${user.title} (${role.toUpperCase()})`, 'info');
    }
  };

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      setActivePage('dashboard');
      showToast(`Logged in as ${user.name} (${user.title})`, 'success');
    }
  };

  const logout = () => {
    setActivePage('login');
    showToast('Logged out of system.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notification center cleared.', 'info');
  };

  const resetToSampleData = () => {
    setVisitors(INITIAL_VISITORS);
    setHosts(INITIAL_HOSTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOrgSettings(DEFAULT_ORG_SETTINGS);
    setCurrentUser(DEMO_USERS.receptionist);
    localStorage.removeItem('passguard_visitors');
    localStorage.removeItem('passguard_hosts');
    localStorage.removeItem('passguard_notifs');
    localStorage.removeItem('passguard_settings');
    localStorage.removeItem('passguard_user');
    showToast('System reset to realistic initial demo data.', 'info');
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        hosts,
        currentUser,
        activePage,
        setActivePage,
        notifications,
        orgSettings,
        selectedVisitor,
        setSelectedVisitor,
        passModalVisitor,
        setPassModalVisitor,
        scannerModalOpen,
        setScannerModalOpen,
        toasts,
        showToast,
        dismissToast,
        registerVisitor,
        checkInVisitor,
        checkOutVisitor,
        approveVisitor,
        rejectVisitor,
        deleteVisitorRecord,
        addHost,
        toggleHostStatus,
        updateOrgSettings,
        switchRole,
        loginAs,
        logout,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        resetToSampleData,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitorContext = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitorContext must be used within a VisitorProvider');
  }
  return context;
};
