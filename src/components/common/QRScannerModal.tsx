import React, { useState } from 'react';
import { useVisitorContext } from '../../context/VisitorContext';
import { 
  X, 
  QrCode, 
  Search, 
  Camera, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  AlertCircle 
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { 
    scannerModalOpen, 
    setScannerModalOpen, 
    visitors, 
    checkInVisitor, 
    checkOutVisitor, 
    setSelectedVisitor,
    showToast 
  } = useVisitorContext();

  const [scanQuery, setScanQuery] = useState('');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!scannerModalOpen) return null;

  const handleProcessScan = (passIdOrCode: string) => {
    setScannedResult(passIdOrCode);
    setFeedback(null);

    // Normalize input
    const cleanId = passIdOrCode.trim().toUpperCase();
    const visitor = visitors.find(
      (v) => v.id.toUpperCase() === cleanId || 
             v.qrCode.toUpperCase().includes(cleanId) ||
             v.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!visitor) {
      setFeedback({
        type: 'error',
        message: `No active pass found matching "${passIdOrCode}". Check ID or register new visitor.`,
      });
      return;
    }

    if (visitor.status === 'expected') {
      checkInVisitor(visitor.id);
      setFeedback({
        type: 'success',
        message: `Check-in successful! Welcome ${visitor.fullName}. Host ${visitor.hostName} notified.`,
      });
    } else if (visitor.status === 'inside') {
      checkOutVisitor(visitor.id);
      setFeedback({
        type: 'success',
        message: `Check-out successful! ${visitor.fullName} has departed. Badge returned.`,
      });
    } else if (visitor.status === 'pending') {
      setFeedback({
        type: 'error',
        message: `Pass ${visitor.id} is pending host approval. Cannot check in yet.`,
      });
      setSelectedVisitor(visitor);
    } else {
      setFeedback({
        type: 'success',
        message: `Pass ${visitor.id} for ${visitor.fullName} (${visitor.status}).`,
      });
      setSelectedVisitor(visitor);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanQuery.trim()) {
      handleProcessScan(scanQuery);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-800">Front Desk Pass Scanner</h3>
          </div>
          <button
            onClick={() => {
              setScannerModalOpen(false);
              setFeedback(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Simulated Scanner Viewport */}
          <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl bg-slate-900 overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
            {/* Viewport Corners */}
            <div className="absolute inset-5 border-2 border-dashed border-blue-400/50 rounded-xl pointer-events-none flex items-center justify-center">
              <QrCode className="w-20 h-20 text-blue-500/30" />
            </div>

            {/* Laser Scanning Animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-[bounce_2.5s_infinite]" />

            <div className="absolute bottom-3 text-center w-full px-4">
              <span className="text-[11px] font-mono text-cyan-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Align QR Code or Barcode
              </span>
            </div>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{feedback.message}</div>
            </div>
          )}

          {/* Quick Test Demo Badges */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              Quick Test Sample Passes
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleProcessScan('VP-8424')}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-left transition-colors cursor-pointer"
              >
                <div className="font-mono font-bold text-blue-700">VP-8424</div>
                <div className="text-[11px] text-slate-600 truncate">Mateo Hernandez</div>
                <div className="text-[10px] text-emerald-600 font-medium">Ready to Check-In</div>
              </button>

              <button
                type="button"
                onClick={() => handleProcessScan('VP-8421')}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-left transition-colors cursor-pointer"
              >
                <div className="font-mono font-bold text-blue-700">VP-8421</div>
                <div className="text-[11px] text-slate-600 truncate">Sophia Montgomery</div>
                <div className="text-[10px] text-slate-500 font-medium">Ready to Check-Out</div>
              </button>

              <button
                type="button"
                onClick={() => handleProcessScan('VP-8425')}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-left transition-colors cursor-pointer"
              >
                <div className="font-mono font-bold text-blue-700">VP-8425</div>
                <div className="text-[11px] text-slate-600 truncate">Charlotte Dubois</div>
                <div className="text-[10px] text-emerald-600 font-medium">Ready to Check-In</div>
              </button>

              <button
                type="button"
                onClick={() => handleProcessScan('VP-8422')}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-left transition-colors cursor-pointer"
              >
                <div className="font-mono font-bold text-blue-700">VP-8422</div>
                <div className="text-[11px] text-slate-600 truncate">Liam O’Connor</div>
                <div className="text-[10px] text-slate-500 font-medium">Ready to Check-Out</div>
              </button>
            </div>
          </div>

          {/* Manual Pass ID or Phone Form */}
          <form onSubmit={handleManualSearch} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-600">
              Or Enter Pass ID or Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. VP-8424 or (415) 890-1234"
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
