import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  UserPlus, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Camera, 
  FileText, 
  Car, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  RefreshCw 
} from 'lucide-react';
import { VisitorPurpose, IdDocumentType } from '../types/visitor';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
];

export const RegistrationPage: React.FC = () => {
  const { 
    hosts, 
    registerVisitor, 
    setPassModalVisitor, 
    setActivePage,
    orgSettings 
  } = useVisitorContext();

  const activeHosts = hosts.filter((h) => h.active);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [hostId, setHostId] = useState(activeHosts[0]?.id || '');
  const [purpose, setPurpose] = useState<VisitorPurpose>('Business Meeting');
  const [expectedDate, setExpectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedTime, setExpectedTime] = useState('11:00');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_AVATARS[0]);
  const [idDocType, setIdDocType] = useState<IdDocumentType>('National ID');
  const [idDocNumber, setIdDocNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [accompanyingGuests, setAccompanyingGuests] = useState(0);
  const [immediateCheckIn, setImmediateCheckIn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Form Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Visitor full name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!hostId) newErrors.hostId = 'Please select a host';
    if (!expectedDate) newErrors.expectedDate = 'Arrival date is required';
    if (!expectedTime) newErrors.expectedTime = 'Arrival time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const selectedHost = hosts.find((h) => h.id === hostId) || hosts[0];

    const newPass = registerVisitor(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || 'Guest',
        hostId: selectedHost.id,
        hostName: selectedHost.name,
        hostDepartment: selectedHost.department,
        purpose,
        expectedDate,
        expectedTime,
        photoUrl: photoUrl || undefined,
        idDocType: idDocType || undefined,
        idDocNumber: idDocNumber.trim() ? idDocNumber.trim() : 'ID-VERIFIED-71',
        vehicleNumber: vehicleNumber.trim() || undefined,
        accompanyingGuests: Number(accompanyingGuests) || 0,
        preRegistered: !immediateCheckIn,
      },
      immediateCheckIn
    );

    setIsSubmitting(false);

    // Open badge pass preview
    setPassModalVisitor(newPass);

    // Reset or redirect
    if (immediateCheckIn) {
      setActivePage('checkinout');
    }
  };

  // Quick fill demo visitor
  const handleQuickFill = () => {
    setFullName('Julian Ross');
    setPhone('+1 (415) 802-9912');
    setEmail('j.ross@vanguard-tech.com');
    setCompany('Vanguard Robotics');
    setHostId(activeHosts[0]?.id || '');
    setPurpose('Business Meeting');
    setIdDocType('Passport');
    setIdDocNumber('P-9804210');
    setVehicleNumber('CA 8KLA90');
    setAccompanyingGuests(1);
    setPhotoUrl(SAMPLE_AVATARS[1]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Fast Demo Auto-fill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">New Visitor Registration</h2>
          <p className="text-xs text-slate-500">
            Issue visitor pass, capture credentials, and notify host personnel.
          </p>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Auto-fill Sample Data</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Registration Mode: Walk-In vs Scheduled Pre-Registration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Registration Mode</span>
              <p className="text-[11px] text-slate-500">
                Choose whether the visitor is at the desk now or arriving later.
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setImmediateCheckIn(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  !immediateCheckIn
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pre-Registration (Scheduled)
              </button>
              <button
                type="button"
                onClick={() => setImmediateCheckIn(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  immediateCheckIn
                    ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Immediate Front Desk Walk-In
              </button>
            </div>
          </div>

          {/* Section 1: Visitor Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Visitor Personal & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-blue-500 bg-white'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 font-mono ${
                      errors.phone
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-blue-500 bg-white'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. visitor@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Company / Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp / Self"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Meeting & Purpose */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Meeting & Purpose Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Person to Meet (Host) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Person to Meet (Host) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={hostId}
                  onChange={(e) => setHostId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {activeHosts.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.designation} ({h.department})
                    </option>
                  ))}
                </select>
                {errors.hostId && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.hostId}</p>
                )}
              </div>

              {/* Purpose of Visit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose of Visit <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as VisitorPurpose)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Job Interview">Job Interview</option>
                  <option value="Vendor & Supplier">Vendor & Supplier</option>
                  <option value="Client Presentation">Client Presentation</option>
                  <option value="Delivery & Courier">Delivery & Courier</option>
                  <option value="Maintenance & IT">Maintenance & IT</option>
                  <option value="Campus Tour">Campus Tour</option>
                  <option value="Personal Visit">Personal Visit</option>
                </select>
              </div>

              {/* Arrival Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Arrival <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Arrival Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheduled Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="time"
                    required
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Identity & Photograph */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Identity Verification & Visitor Photograph</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Photo Preview & Presets */}
              <div className="sm:col-span-1 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Visitor Photo (for Security Badge)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-28 rounded-xl bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Visitor snapshot" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">Select avatar or live photo</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoUrl(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-transform ${
                            photoUrl === url ? 'border-blue-600 scale-110' : 'border-transparent'
                          }`}
                        >
                          <img src={url} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Document Type & Number */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ID Document Type (Optional)
                  </label>
                  <select
                    value={idDocType}
                    onChange={(e) => setIdDocType(e.target.value as IdDocumentType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="National ID">National ID / Aadhaar / SSN</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Employee Badge">Employee Badge</option>
                    <option value="Student ID">Student ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document ID Number (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. DL-4091244"
                      value={idDocNumber}
                      onChange={(e) => setIdDocNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Number (Parking Pass)
                  </label>
                  <div className="relative">
                    <Car className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. CA 7XYZ89"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Accompanying Guests Count
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={accompanyingGuests}
                      onChange={(e) => setAccompanyingGuests(parseInt(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {immediateCheckIn 
                ? 'Will immediately activate pass & issue physical entry badge.' 
                : 'Will register visitor and generate printable pass.'}
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{immediateCheckIn ? 'Register & Check In Now' : 'Register Visitor'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
