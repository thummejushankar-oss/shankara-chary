import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  Users, 
  LogIn, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  UserPlus, 
  QrCode, 
  Printer, 
  Search, 
  Building, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { HOURLY_ACTIVITY_DATA } from '../data/mockData';
import officeBannerImg from '../assets/images/office_campus_banner_1791622169513.jpg';

export const DashboardPage: React.FC = () => {
  const { 
    visitors, 
    setActivePage, 
    setSelectedVisitor, 
    setPassModalVisitor, 
    checkInVisitor, 
    checkOutVisitor,
    setScannerModalOpen,
    orgSettings,
    currentUser 
  } = useVisitorContext();

  const [activeTabChart, setActiveTabChart] = useState<'hourly' | 'inside'>('hourly');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Compute live summary statistics
  const todayDate = new Date().toISOString().split('T')[0];
  
  // Today's total visitors (all visitors scheduled or active today)
  const totalToday = visitors.filter((v) => v.expectedDate === todayDate || v.checkInTime?.startsWith(todayDate)).length;
  const currentlyInside = visitors.filter((v) => v.status === 'inside').length;
  const expectedToday = visitors.filter((v) => v.status === 'expected').length;
  const completedToday = visitors.filter((v) => v.status === 'completed').length;
  const pendingApprovals = visitors.filter((v) => v.status === 'pending').length;

  // Recent 6 visitors
  const recentVisitors = [...visitors].slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inside':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Inside</span>;
      case 'expected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Expected</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Facility Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm">
        <img
          src={officeBannerImg}
          alt="Nexus Corporate Headquarters Lobby"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{orgSettings.buildingName} · Active Security Operations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Front desk is live. There are currently <strong className="text-white font-mono">{currentlyInside}</strong> visitors on-premises and <strong className="text-white font-mono">{expectedToday}</strong> arrivals scheduled today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePage('registration')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Walk-in</span>
            </button>
            <button
              onClick={() => setScannerModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/10 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Front Desk Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Today */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Today</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalToday}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled & walk-ins</p>
        </div>

        {/* Currently Inside */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Currently Inside</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {currentlyInside}
            </span>
            <span className="text-[11px] text-slate-500">active badges</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">On-premise headcount</p>
        </div>

        {/* Expected Visitors */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expected</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
              {expectedToday}
            </span>
            <span className="text-[11px] text-slate-500">approved</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting reception</p>
        </div>

        {/* Completed Visits */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 font-mono tabular-nums">
              {completedToday}
            </span>
            <span className="text-[11px] text-slate-500">checked out</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Safely departed</p>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => setActivePage('approvals')}
          className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-2xs hover:bg-amber-50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900 font-mono tabular-nums">
              {pendingApprovals}
            </span>
            <span className="text-[11px] text-amber-700 font-medium flex items-center">
              Requires action <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Click to review requests</p>
        </div>
      </div>

      {/* Main Grid: Visitor Activity Chart & Quick Front Desk Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Activity Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today’s Visitor Footfall Flow</h3>
              <p className="text-xs text-slate-500">
                Hourly check-in volume vs on-site concurrent occupancy
              </p>
            </div>
            {/* Segmented Chart View Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setActiveTabChart('hourly')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTabChart === 'hourly'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Check-ins by Hour
              </button>
              <button
                onClick={() => setActiveTabChart('inside')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTabChart === 'inside'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Concurrent Inside
              </button>
            </div>
          </div>

          {/* SVG Bar / Area Chart */}
          <div className="pt-2">
            <div className="h-56 w-full flex items-end gap-2 sm:gap-3 px-2 pb-6 border-b border-slate-200 relative">
              {/* Reference Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 pointer-events-none flex justify-between text-[10px] text-slate-300">
                <span>25 max</span>
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100 pointer-events-none flex justify-between text-[10px] text-slate-300">
                <span>12 avg</span>
              </div>

              {HOURLY_ACTIVITY_DATA.map((item, idx) => {
                const val = activeTabChart === 'hourly' ? item.checkIns : item.inside;
                const maxVal = activeTabChart === 'hourly' ? 15 : 25;
                const heightPercent = Math.max(10, Math.min(100, (val / maxVal) * 100));

                return (
                  <div
                    key={item.hour}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on Hover */}
                    {hoveredBarIndex === idx && (
                      <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] whitespace-nowrap shadow-lg pointer-events-none">
                        <span className="font-semibold">{item.hour}: </span>
                        <span className="font-mono">{val} {activeTabChart === 'hourly' ? 'arrivals' : 'inside'}</span>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        activeTabChart === 'hourly'
                          ? 'bg-blue-600 group-hover:bg-blue-500'
                          : 'bg-emerald-600 group-hover:bg-emerald-500'
                      }`}
                    />

                    {/* X-axis Label */}
                    <span className="absolute -bottom-5 text-[10px] text-slate-400 truncate w-full text-center">
                      {item.hour.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend & Stats */}
            <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${activeTabChart === 'hourly' ? 'bg-blue-600' : 'bg-emerald-600'}`} />
                  <span>{activeTabChart === 'hourly' ? 'Hourly Arrivals' : 'Occupants Inside'}</span>
                </span>
                <span className="text-slate-400">·</span>
                <span>Peak Traffic: <strong className="text-slate-700">10:00 AM – 11:30 AM</strong></span>
              </div>
              <button
                onClick={() => setActivePage('reports')}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Fast Reception Desk Actions & Highlights (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Front Desk Quick Actions</h3>
            <p className="text-xs text-slate-500">
              Rapid operations for incoming and departing visitors.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => setActivePage('registration')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Pre-Register or Walk-In</h4>
                    <p className="text-[11px] text-slate-500">Issue pass & record host details</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => setScannerModalOpen(true)}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Verify QR Code / Badge</h4>
                    <p className="text-[11px] text-slate-500">Fast 1-second front gate scan</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => setActivePage('checkinout')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Check-In / Out Hub</h4>
                    <p className="text-[11px] text-slate-500">Manage badge surrender & times</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          {/* Wi-Fi & Facility Assistance Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-slate-800 font-semibold">
              <span>Guest Wi-Fi SSID:</span>
              <span className="font-mono text-blue-700">{orgSettings.guestWifiSsid}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Emergency Security Desk:</span>
              <span className="font-mono">{orgSettings.contactEmergency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Visitors & Activity Feed</h3>
            <p className="text-xs text-slate-500">
              Real-time register log of recent visitors and actions
            </p>
          </div>
          <button
            onClick={() => setActivePage('records')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records ({visitors.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pl-2">Pass ID</th>
                <th className="pb-3">Visitor Name</th>
                <th className="pb-3">Host & Dept</th>
                <th className="pb-3">Purpose</th>
                <th className="pb-3">Scheduled / Check-In</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentVisitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3 pl-2 font-mono font-bold text-blue-600">
                    {v.id}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        {v.photoUrl ? (
                          <img src={v.photoUrl} alt={v.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {v.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{v.fullName}</div>
                        <div className="text-[11px] text-slate-500">{v.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-slate-800">{v.hostName}</div>
                    <div className="text-[11px] text-slate-400">{v.hostDepartment}</div>
                  </td>
                  <td className="py-3 text-slate-600">{v.purpose}</td>
                  <td className="py-3 font-mono text-slate-600">
                    {v.checkInTime ? (
                      <span className="text-emerald-700 font-semibold">{v.checkInTime.split(' ')[1]} (In)</span>
                    ) : (
                      <span>{v.expectedTime}</span>
                    )}
                  </td>
                  <td className="py-3">{getStatusBadge(v.status)}</td>
                  <td className="py-3 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVisitor(v)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View details & timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPassModalVisitor(v)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Print badge pass"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {v.status === 'expected' && (
                        <button
                          onClick={() => checkInVisitor(v.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                        >
                          Check In
                        </button>
                      )}
                      {v.status === 'inside' && (
                        <button
                          onClick={() => checkOutVisitor(v.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
