import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Building, 
  User, 
  Calendar, 
  Eye, 
  Printer, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { VisitorRecord } from '../types/visitor';

export const ApprovalPage: React.FC = () => {
  const { 
    visitors, 
    hosts, 
    approveVisitor, 
    rejectVisitor, 
    setSelectedVisitor, 
    setPassModalVisitor, 
    currentUser 
  } = useVisitorContext();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHostFilter, setSelectedHostFilter] = useState<string>('all');
  
  // Rejection modal prompt
  const [rejectingVisitor, setRejectingVisitor] = useState<VisitorRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter visitors
  const filteredVisitors = visitors.filter((v) => {
    // Status tab filter
    if (activeTab === 'pending' && v.status !== 'pending') return false;
    if (activeTab === 'approved' && v.status !== 'expected' && v.status !== 'inside' && v.status !== 'completed') return false;
    if (activeTab === 'rejected' && v.status !== 'rejected') return false;

    // Host filter
    if (selectedHostFilter !== 'all' && v.hostId !== selectedHostFilter) return false;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        v.fullName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const pendingCount = visitors.filter((v) => v.status === 'pending').length;
  const approvedCount = visitors.filter((v) => v.status === 'expected' || v.status === 'inside' || v.status === 'completed').length;
  const rejectedCount = visitors.filter((v) => v.status === 'rejected').length;

  const handleConfirmReject = () => {
    if (!rejectingVisitor) return;
    rejectVisitor(rejectingVisitor.id, rejectReason || 'Visit declined by security/host.');
    setRejectingVisitor(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Visitor Approval Queue</h2>
          <p className="text-xs text-slate-500">
            Review, authorize, or decline incoming guest visit requests.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <span>Authorizing Role:</span>
          <strong className="text-blue-700 capitalize font-medium">{currentUser.role} ({currentUser.name})</strong>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'pending'
                  ? 'bg-white text-amber-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Requests</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-200 text-amber-900 font-mono">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'approved'
                  ? 'bg-white text-blue-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Approved</span>
              <span className="text-[10px] text-slate-400 font-mono">({approvedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'rejected'
                  ? 'bg-white text-rose-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Rejected</span>
              <span className="text-[10px] text-slate-400 font-mono">({rejectedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Requests ({visitors.length})
            </button>
          </div>

          {/* Search & Host Filter */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search visitor, host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedHostFilter}
              onChange={(e) => setSelectedHostFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Hosts</option>
              {hosts.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visitor Requests Grid / Cards */}
      {filteredVisitors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'All visitor requests have been addressed! Check back when new guest registrations arrive.'
              : 'No visitor records match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVisitors.map((v) => {
            const isPending = v.status === 'pending';
            const isRejected = v.status === 'rejected';

            return (
              <div
                key={v.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-2xs flex flex-col justify-between ${
                  isPending ? 'border-amber-300 ring-1 ring-amber-200/50' : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Visitor ID & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {v.photoUrl ? (
                          <img src={v.photoUrl} alt={v.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                            {v.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700">{v.id}</span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 font-mono">{v.createdAt}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{v.fullName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.company || 'Private Guest'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                  </div>

                  {/* Visit Details Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Host to Meet</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{v.hostName}</p>
                      <p className="text-[11px] text-slate-500">{v.hostDepartment}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Purpose</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{v.purpose}</p>
                      <p className="text-[11px] text-slate-500">{v.accompanyingGuests > 0 ? `+${v.accompanyingGuests} guest(s)` : 'Solo visit'}</p>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{v.expectedDate} at {v.expectedTime}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {v.idDocType || 'ID Document Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Approval / Rejection Note if available */}
                  {v.approvalNotes && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                      <p className="font-semibold text-[11px] text-emerald-800">
                        Approved by {v.approvedBy || 'Host'}:
                      </p>
                      <p className="italic text-[11px] mt-0.5">"{v.approvalNotes}"</p>
                    </div>
                  )}

                  {v.rejectionReason && (
                    <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-xs text-rose-900">
                      <p className="font-semibold text-[11px] text-rose-800">Rejection Reason:</p>
                      <p className="italic text-[11px] mt-0.5">"{v.rejectionReason}"</p>
                    </div>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedVisitor(v)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Inspect full visitor profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => setPassModalVisitor(v)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="View printable pass"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                  </div>

                  {/* Action buttons */}
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRejectingVisitor(v)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => approveVisitor(v.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Pass</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Processed by {v.approvedBy || 'System'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Confirmation Modal */}
      {rejectingVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Reject Visit for {rejectingVisitor.fullName}
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Specify the reason for rejecting pass <strong className="font-mono">{rejectingVisitor.id}</strong>. The visitor and front desk will be notified.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Host unavailable at this time, please reschedule through company coordinator..."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingVisitor(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
