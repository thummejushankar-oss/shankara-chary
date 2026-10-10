import React, { useState } from 'react';
import { useVisitorContext } from '../../context/VisitorContext';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut, 
  Eye, 
  EyeOff, 
  Car, 
  Users, 
  FileText
} from 'lucide-react';

export const VisitorDetailModal: React.FC = () => {
  const { 
    selectedVisitor, 
    setSelectedVisitor, 
    setPassModalVisitor, 
    checkInVisitor, 
    checkOutVisitor, 
    approveVisitor, 
    rejectVisitor,
    currentUser 
  } = useVisitorContext();

  const [showIdDetails, setShowIdDetails] = useState(false);
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState(false);
  const [reasonText, setReasonText] = useState('');

  if (!selectedVisitor) return null;

  const handleApprove = () => {
    approveVisitor(selectedVisitor.id);
    setSelectedVisitor(null);
  };

  const handleReject = () => {
    if (!reasonText.trim()) return;
    rejectVisitor(selectedVisitor.id, reasonText);
    setRejectReasonPrompt(false);
    setSelectedVisitor(null);
  };

  const handleCheckIn = () => {
    checkInVisitor(selectedVisitor.id);
    setSelectedVisitor(null);
  };

  const handleCheckOut = () => {
    checkOutVisitor(selectedVisitor.id);
    setSelectedVisitor(null);
  };

  const handlePrintBadge = () => {
    setPassModalVisitor(selectedVisitor);
    setSelectedVisitor(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inside':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Currently Inside</span>;
      case 'expected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">Expected / Approved</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">Completed Visit</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">Pending Approval</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {selectedVisitor.id}
            </span>
            <h3 className="font-bold text-base text-slate-900">Visitor Profile & Timeline</h3>
          </div>
          <button
            onClick={() => setSelectedVisitor(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                {selectedVisitor.photoUrl ? (
                  <img
                    src={selectedVisitor.photoUrl}
                    alt={selectedVisitor.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900">{selectedVisitor.fullName}</h2>
                  {getStatusBadge(selectedVisitor.status)}
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedVisitor.company || 'Private Guest'}</span>
                </p>
                {selectedVisitor.badgeNumber && (
                  <p className="text-xs font-mono font-semibold text-blue-700 mt-1">
                    Assigned Badge: {selectedVisitor.badgeNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handlePrintBadge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>View & Print Badge</span>
              </button>
            </div>
          </div>

          {/* Grid Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Details */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Contact Details</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedVisitor.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{selectedVisitor.phone}</span>
                </div>
                {selectedVisitor.vehicleNumber && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Vehicle: <strong className="font-mono">{selectedVisitor.vehicleNumber}</strong></span>
                  </div>
                )}
                {selectedVisitor.accompanyingGuests > 0 && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Accompanying: <strong>+{selectedVisitor.accompanyingGuests} guest(s)</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Host Details */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Host & Purpose</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Person to Meet</span>
                  <p className="font-semibold text-slate-800">{selectedVisitor.hostName}</p>
                  <p className="text-slate-500">{selectedVisitor.hostDepartment}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Visit Purpose</span>
                  <p className="font-medium text-slate-800">{selectedVisitor.purpose}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Identity & Verification Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Security & Identity Verification</span>
              </h4>
              <button
                onClick={() => setShowIdDetails(!showIdDetails)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                {showIdDetails ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Mask ID Number</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Reveal ID Number</span>
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Document Type</span>
                <p className="font-medium text-slate-800">{selectedVisitor.idDocType || 'National ID'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Document ID</span>
                <p className="font-mono font-semibold text-slate-800">
                  {showIdDetails 
                    ? (selectedVisitor.idDocNumber?.replace('••••', '942') || 'ID-Verified') 
                    : (selectedVisitor.idDocNumber || '••••••••')}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Pre-Registered</span>
                <p className="font-medium text-slate-800">
                  {selectedVisitor.preRegistered ? 'Yes (Online)' : 'Walk-in Registration'}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Trail Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Trail & Check-In History
            </h4>
            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <p className="font-medium text-slate-800">Pass Created / Registered</p>
                <p className="text-slate-500 text-[11px]">{selectedVisitor.createdAt}</p>
              </div>

              {selectedVisitor.approvedAt && (
                <div className="relative pt-2">
                  <div className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <p className="font-medium text-slate-800">
                    Approved by {selectedVisitor.approvedBy || 'Host'}
                  </p>
                  <p className="text-slate-500 text-[11px]">{selectedVisitor.approvedAt}</p>
                  {selectedVisitor.approvalNotes && (
                    <p className="text-slate-600 italic text-[11px] mt-0.5">
                      "{selectedVisitor.approvalNotes}"
                    </p>
                  )}
                </div>
              )}

              {selectedVisitor.rejectionReason && (
                <div className="relative pt-2">
                  <div className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white" />
                  <p className="font-medium text-rose-700">Rejected</p>
                  <p className="text-rose-600 text-[11px] mt-0.5">
                    Reason: "{selectedVisitor.rejectionReason}"
                  </p>
                </div>
              )}

              {selectedVisitor.checkInTime && (
                <div className="relative pt-2">
                  <div className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <p className="font-medium text-slate-800">
                    Checked In at Reception Desk
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {selectedVisitor.checkInTime} · Badge {selectedVisitor.badgeNumber} assigned
                  </p>
                </div>
              )}

              {selectedVisitor.checkOutTime && (
                <div className="relative pt-2">
                  <div className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-white" />
                  <p className="font-medium text-slate-800">Checked Out (Completed)</p>
                  <p className="text-slate-500 text-[11px]">
                    {selectedVisitor.checkOutTime} · Stay Duration: {selectedVisitor.stayDuration || 'Recorded'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Prompt Form if active */}
          {rejectReasonPrompt && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
              <p className="text-xs font-semibold text-rose-800">
                Please provide a rejection note for this visit request:
              </p>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Reason for declining visit (e.g., host unavailable, reschedule requested)..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setRejectReasonPrompt(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!reasonText.trim()}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            Current Status: <strong className="capitalize text-slate-700">{selectedVisitor.status}</strong>
          </div>

          <div className="flex items-center gap-2">
            {/* If pending approval and user is admin or host */}
            {selectedVisitor.status === 'pending' && (
              <>
                <button
                  onClick={() => setRejectReasonPrompt(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Visit</span>
                </button>
              </>
            )}

            {/* If expected/approved, allow check-in */}
            {selectedVisitor.status === 'expected' && (
              <button
                onClick={handleCheckIn}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Check-In Visitor</span>
              </button>
            )}

            {/* If currently inside, allow check-out */}
            {selectedVisitor.status === 'inside' && (
              <button
                onClick={handleCheckOut}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Check-Out Visitor</span>
              </button>
            )}

            <button
              onClick={() => setSelectedVisitor(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
