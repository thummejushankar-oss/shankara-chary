import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  LogIn, 
  LogOut, 
  Search, 
  QrCode, 
  Clock, 
  Printer, 
  Building, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Eye, 
  Sparkles,
  Phone
} from 'lucide-react';

export const CheckInOutPage: React.FC = () => {
  const { 
    visitors, 
    checkInVisitor, 
    checkOutVisitor, 
    setSelectedVisitor, 
    setPassModalVisitor, 
    setScannerModalOpen,
    orgSettings 
  } = useVisitorContext();

  const [activeTab, setActiveTab] = useState<'checkin' | 'inside' | 'completed'>('inside');
  const [searchQuery, setSearchQuery] = useState('');
  const [customBadgeNumber, setCustomBadgeNumber] = useState('');
  const [badgePromptVisitorId, setBadgePromptVisitorId] = useState<string | null>(null);

  // Group visitors by operational state
  const expectedVisitors = visitors.filter((v) => v.status === 'expected');
  const insideVisitors = visitors.filter((v) => v.status === 'inside');
  const completedTodayVisitors = visitors.filter((v) => v.status === 'completed');

  // Filter based on active tab and search query
  const getDisplayedList = () => {
    let list = [];
    if (activeTab === 'checkin') list = expectedVisitors;
    else if (activeTab === 'inside') list = insideVisitors;
    else list = completedTodayVisitors;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (v) =>
        v.fullName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.phone.includes(q) ||
        (v.badgeNumber && v.badgeNumber.toLowerCase().includes(q))
    );
  };

  const displayedList = getDisplayedList();

  const handlePerformCheckIn = (id: string) => {
    checkInVisitor(id, customBadgeNumber.trim() ? customBadgeNumber.trim() : undefined);
    setBadgePromptVisitorId(null);
    setCustomBadgeNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reception Check-In & Check-Out Desk</h2>
          <p className="text-xs text-slate-500">
            Real-time gatekeeper station for badge assignment, physical access logging, and departure tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScannerModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Pass Scanner</span>
          </button>
        </div>
      </div>

      {/* Operational Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented Operational Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs overflow-x-auto">
            {/* Inside Tab */}
            <button
              onClick={() => setActiveTab('inside')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'inside'
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Currently Inside</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono ${
                activeTab === 'inside' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {insideVisitors.length}
              </span>
            </button>

            {/* Check-In Tab */}
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'checkin'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready for Check-In</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono ${
                activeTab === 'checkin' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                {expectedVisitors.length}
              </span>
            </button>

            {/* Completed Tab */}
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'completed'
                  ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Checked Out Today</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-mono ${
                activeTab === 'completed' ? 'text-slate-200' : 'text-slate-400'
              }`}>
                ({completedTodayVisitors.length})
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, phone, badge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table / List */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">No visitors in this queue</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {activeTab === 'inside'
                ? 'No visitors are currently marked on-premises. Check in expected arrivals above.'
                : activeTab === 'checkin'
                ? 'No visitors waiting to check in. Pre-register a guest or register a walk-in.'
                : 'No departures recorded yet today.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Pass ID</th>
                  <th className="pb-3">Visitor Name & Org</th>
                  <th className="pb-3">Host & Dept</th>
                  <th className="pb-3">Purpose</th>
                  <th className="pb-3">
                    {activeTab === 'inside' ? 'Entry Time & Badge' : activeTab === 'checkin' ? 'Scheduled Time' : 'Duration'}
                  </th>
                  <th className="pb-3 pr-2 text-right">Gate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedList.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Pass ID */}
                    <td className="py-3 pl-2 font-mono font-bold text-blue-700">
                      {v.id}
                    </td>

                    {/* Visitor Name & Org */}
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                          {v.photoUrl ? (
                            <img src={v.photoUrl} alt={v.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-slate-600">
                              {v.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{v.fullName}</div>
                          <div className="text-[11px] text-slate-500">{v.company} · {v.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Host & Department */}
                    <td className="py-3">
                      <div className="font-semibold text-slate-800">{v.hostName}</div>
                      <div className="text-[11px] text-slate-500">{v.hostDepartment}</div>
                    </td>

                    {/* Purpose */}
                    <td className="py-3">
                      <span className="text-slate-700">{v.purpose}</span>
                      {v.accompanyingGuests > 0 && (
                        <span className="text-[10px] text-blue-600 block">+{v.accompanyingGuests} guest(s)</span>
                      )}
                    </td>

                    {/* Timestamp / Badge column */}
                    <td className="py-3 font-mono text-xs">
                      {activeTab === 'inside' && (
                        <div>
                          <div className="text-emerald-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span>{v.checkInTime?.split(' ')[1] || '09:00'}</span>
                          </div>
                          <div className="text-[11px] text-blue-700 font-bold">
                            {v.badgeNumber || 'Badge Assigned'}
                          </div>
                        </div>
                      )}

                      {activeTab === 'checkin' && (
                        <div>
                          <span className="text-slate-700 font-semibold">{v.expectedTime}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">{v.expectedDate}</span>
                        </div>
                      )}

                      {activeTab === 'completed' && (
                        <div>
                          <span className="text-slate-700 font-semibold">{v.stayDuration || 'Recorded'}</span>
                          <span className="text-[10px] text-slate-400 block">
                            Out at {v.checkOutTime?.split(' ')[1] || 'Departed'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVisitor(v)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View audit details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPassModalVisitor(v)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Print physical badge"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Check In Action for Expected */}
                        {activeTab === 'checkin' && (
                          <div className="relative">
                            {badgePromptVisitorId === v.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="#B-XXX"
                                  value={customBadgeNumber}
                                  onChange={(e) => setCustomBadgeNumber(e.target.value)}
                                  className="w-20 px-2 py-1 text-xs border border-blue-400 rounded-md font-mono"
                                />
                                <button
                                  onClick={() => handlePerformCheckIn(v.id)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md cursor-pointer"
                                >
                                  Done
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setBadgePromptVisitorId(v.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Check In</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Check Out Action for Inside */}
                        {activeTab === 'inside' && (
                          <button
                            onClick={() => checkOutVisitor(v.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Check Out</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
