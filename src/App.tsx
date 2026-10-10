import React, { useState } from 'react';
import { VisitorProvider, useVisitorContext } from './context/VisitorContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BadgePassModal } from './components/common/BadgePassModal';
import { VisitorDetailModal } from './components/common/VisitorDetailModal';
import { QRScannerModal } from './components/common/QRScannerModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ApprovalPage } from './pages/ApprovalPage';
import { CheckInOutPage } from './pages/CheckInOutPage';
import { RecordsPage } from './pages/RecordsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const MainAppLayout: React.FC = () => {
  const { activePage } = useVisitorContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render full screen login
  if (activePage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'registration':
        return <RegistrationPage />;
      case 'approvals':
        return <ApprovalPage />;
      case 'checkinout':
        return <CheckInOutPage />;
      case 'records':
        return <RecordsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Toasts */}
      <BadgePassModal />
      <VisitorDetailModal />
      <QRScannerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <VisitorProvider>
      <MainAppLayout />
    </VisitorProvider>
  );
}
