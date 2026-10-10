import React from 'react';
import { useVisitorContext } from '../../context/VisitorContext';
import { Printer, X, ShieldCheck, Wifi, Phone, Clock, User, Building, QrCode } from 'lucide-react';
import securitySealImg from '../../assets/images/security_crest_seal_1791622181243.jpg';

export const BadgePassModal: React.FC = () => {
  const { passModalVisitor, setPassModalVisitor, orgSettings } = useVisitorContext();

  if (!passModalVisitor) return null;

  const handlePrint = () => {
    window.print();
  };

  // Status badge style
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inside':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'expected':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-slate-700 bg-slate-100 border-slate-300';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Official Visitor Pass & Badge</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={() => setPassModalVisitor(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
              aria-label="Close pass preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 bg-slate-100/70" id="printable-badge">
          <div className="relative mx-auto bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden max-w-md">
            {/* Top Color Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-wider uppercase font-semibold text-blue-200">
                    {orgSettings.organizationName}
                  </p>
                  <h4 className="text-base font-bold tracking-tight">VISITOR SECURITY PASS</h4>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold bg-white text-blue-800 rounded">
                    {passModalVisitor.badgeNumber || passModalVisitor.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Pass Body */}
            <div className="p-5 relative">
              {/* Background Watermark Crest */}
              <div className="absolute right-4 bottom-12 w-32 h-32 opacity-10 pointer-events-none select-none">
                <img
                  src={securitySealImg}
                  alt="Security Watermark"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Visitor Details Card */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                <div className="w-20 h-24 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {passModalVisitor.photoUrl ? (
                    <img
                      src={passModalVisitor.photoUrl}
                      alt={passModalVisitor.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border mb-1 ${getStatusColor(
                      passModalVisitor.status
                    )}`}
                  >
                    {passModalVisitor.status.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {passModalVisitor.fullName}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{passModalVisitor.company || 'Independent Visitor'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pass ID: <span className="font-mono font-semibold text-slate-700">{passModalVisitor.id}</span>
                  </p>
                </div>
              </div>

              {/* Host & Meeting Information */}
              <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Host / Escort</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{passModalVisitor.hostName}</p>
                  <p className="text-[11px] text-slate-500">{passModalVisitor.hostDepartment}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Purpose</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{passModalVisitor.purpose}</p>
                  <p className="text-[11px] text-slate-500">{passModalVisitor.accompanyingGuests > 0 ? `+${passModalVisitor.accompanyingGuests} guest(s)` : 'Single visitor'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Date of Visit</span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5">{passModalVisitor.expectedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Check-In Time</span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {passModalVisitor.checkInTime ? passModalVisitor.checkInTime.split(' ')[1] : `Scheduled: ${passModalVisitor.expectedTime}`}
                  </p>
                </div>
              </div>

              {/* QR Code and Verification Row */}
              <div className="flex items-center justify-between pt-3 gap-3">
                <div className="flex-1 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Wifi className="w-3.5 h-3.5 text-blue-600" />
                    <span>Wi-Fi: <strong className="font-mono">{orgSettings.guestWifiSsid}</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Password: <span className="font-mono text-slate-600">{orgSettings.guestWifiPassword}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Emergency: {orgSettings.contactEmergency}</span>
                  </div>
                </div>

                {/* SVG Simulated QR Code */}
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center">
                  <svg className="w-16 h-16" viewBox="0 0 100 100" fill="currentColor">
                    {/* QR code corners */}
                    <rect x="5" y="5" width="28" height="28" rx="3" fill="#1e293b" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="#1e293b" />

                    <rect x="67" y="5" width="28" height="28" rx="3" fill="#1e293b" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="#1e293b" />

                    <rect x="5" y="67" width="28" height="28" rx="3" fill="#1e293b" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="#1e293b" />

                    {/* Data matrix dots */}
                    <rect x="38" y="10" width="6" height="6" fill="#1e293b" />
                    <rect x="48" y="10" width="6" height="6" fill="#1e293b" />
                    <rect x="38" y="24" width="6" height="6" fill="#1e293b" />
                    <rect x="50" y="24" width="8" height="6" fill="#1e293b" />
                    <rect x="10" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="22" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="38" y="38" width="8" height="8" fill="#2563eb" />
                    <rect x="52" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="68" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="80" y="38" width="8" height="6" fill="#1e293b" />
                    <rect x="38" y="52" width="6" height="8" fill="#1e293b" />
                    <rect x="50" y="52" width="8" height="6" fill="#1e293b" />
                    <rect x="68" y="52" width="6" height="6" fill="#1e293b" />
                    <rect x="80" y="52" width="8" height="8" fill="#1e293b" />
                    <rect x="38" y="68" width="8" height="6" fill="#1e293b" />
                    <rect x="52" y="68" width="6" height="6" fill="#1e293b" />
                    <rect x="68" y="68" width="6" height="8" fill="#1e293b" />
                    <rect x="80" y="68" width="6" height="6" fill="#1e293b" />
                    <rect x="38" y="80" width="6" height="8" fill="#1e293b" />
                    <rect x="50" y="80" width="10" height="6" fill="#1e293b" />
                    <rect x="68" y="80" width="8" height="6" fill="#1e293b" />
                  </svg>
                  <span className="text-[8px] font-mono font-medium text-slate-500 mt-1">SCAN AT GATE</span>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="mt-3 pt-2 border-t border-dashed border-slate-200 text-center">
                <p className="text-[9px] text-slate-400">
                  Must be visibly worn at all times. Return to Front Desk Concierge upon departure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500">
            Pass ID: <span className="font-mono font-medium text-slate-700">{passModalVisitor.id}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPassModalVisitor(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Visitor Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
