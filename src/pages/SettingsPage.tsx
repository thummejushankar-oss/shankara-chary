import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  Settings, 
  Users, 
  Shield, 
  Building, 
  Wifi, 
  Plus, 
  Check, 
  X, 
  Phone, 
  Mail, 
  AlertTriangle, 
  RotateCcw, 
  LogOut, 
  Save, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Host, UserRole } from '../types/visitor';

export const SettingsPage: React.FC = () => {
  const { 
    hosts, 
    addHost, 
    toggleHostStatus, 
    orgSettings, 
    updateOrgSettings, 
    currentUser, 
    switchRole, 
    logout, 
    resetToSampleData 
  } = useVisitorContext();

  const [activeTab, setActiveTab] = useState<'hosts' | 'org' | 'roles'>('hosts');

  // Org Settings Local State
  const [orgName, setOrgName] = useState(orgSettings.organizationName);
  const [buildingName, setBuildingName] = useState(orgSettings.buildingName);
  const [wifiSsid, setWifiSsid] = useState(orgSettings.guestWifiSsid);
  const [wifiPass, setWifiPass] = useState(orgSettings.guestWifiPassword);
  const [emergencyPhone, setEmergencyPhone] = useState(orgSettings.contactEmergency);
  const [requireApproval, setRequireApproval] = useState(orgSettings.requireApproval);
  const [requirePhoto, setRequirePhoto] = useState(orgSettings.requirePhoto);

  // New Host Modal State
  const [showAddHostModal, setShowAddHostModal] = useState(false);
  const [newHostName, setNewHostName] = useState('');
  const [newHostEmail, setNewHostEmail] = useState('');
  const [newHostPhone, setNewHostPhone] = useState('');
  const [newHostDept, setNewHostDept] = useState('Engineering');
  const [newHostDesignation, setNewHostDesignation] = useState('');
  const [newHostRoom, setNewHostRoom] = useState('');

  const handleSaveOrgSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      organizationName: orgName,
      buildingName,
      guestWifiSsid: wifiSsid,
      guestWifiPassword: wifiPass,
      contactEmergency: emergencyPhone,
      requireApproval,
      requirePhoto,
    });
  };

  const handleCreateHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostName.trim() || !newHostEmail.trim()) return;

    addHost({
      name: newHostName.trim(),
      email: newHostEmail.trim(),
      phone: newHostPhone.trim() || '+1 (555) 000-1122',
      department: newHostDept,
      designation: newHostDesignation.trim() || 'Team Lead',
      officeRoom: newHostRoom.trim() || 'Floor 3',
      active: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    setShowAddHostModal(false);
    setNewHostName('');
    setNewHostEmail('');
    setNewHostPhone('');
    setNewHostDesignation('');
    setNewHostRoom('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">System & Admin Settings</h2>
          <p className="text-xs text-slate-500">
            Configure host directory, organization access policies, role permissions, and system parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Reset to default mock data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs w-fit">
        <button
          onClick={() => setActiveTab('hosts')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'hosts'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Host & Employee Directory ({hosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('org')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'org'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Facility & Security Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Role-Based Access (RBAC)</span>
        </button>
      </div>

      {/* Tab 1: Host Directory */}
      {activeTab === 'hosts' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Host & Employee Registry</h3>
              <p className="text-xs text-slate-500">
                Staff members authorized to receive external visitors and approve entrance passes.
              </p>
            </div>
            <button
              onClick={() => setShowAddHostModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Host</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Host Name & Avatar</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Designation / Title</th>
                  <th className="pb-3">Contact Email</th>
                  <th className="pb-3">Office Location</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hosts.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={h.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={h.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{h.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{h.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-slate-800">{h.department}</td>
                    <td className="py-3 text-slate-600">{h.designation}</td>
                    <td className="py-3 font-mono text-slate-600">{h.email}</td>
                    <td className="py-3 text-slate-600">{h.officeRoom}</td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => toggleHostStatus(h.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                          h.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {h.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Facility & Org Settings */}
      {activeTab === 'org' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6 max-w-3xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Organization & Security Parameters</h3>
            <p className="text-xs text-slate-500">
              Customize venue details, visitor guidelines, and automated security behaviors.
            </p>
          </div>

          <form onSubmit={handleSaveOrgSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Campus Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building & Facility Title
                </label>
                <input
                  type="text"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guest Wi-Fi Network (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guest Wi-Fi Password Template
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Security Hotline
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Require Host Pre-Approval for all online registrations before check-in
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requirePhoto}
                  onChange={(e) => setRequirePhoto(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Mandate live visitor photograph on printed security badges
                </span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Facility Policies</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Role-Based Access Control */}
      {activeTab === 'roles' && (
        <div className="space-y-4 max-w-4xl">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Current session active role: <strong className="text-blue-700 capitalize font-medium">{currentUser.role}</strong> ({currentUser.title}).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Admin Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                currentUser.role === 'admin' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-300' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Administrator</span>
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Full security governance, approval overrides, host directory management, system settings, and exports.
                </p>
                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Active Account' : 'Switch to Admin'}
                </button>
              </div>

              {/* Receptionist Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                currentUser.role === 'receptionist' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-300' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Reception Desk Concierge</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Front desk check-in/out, rapid QR scanning, visitor pass badge printing, walk-in registration.
                </p>
                <button
                  onClick={() => switchRole('receptionist')}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentUser.role === 'receptionist'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentUser.role === 'receptionist' ? 'Active Account' : 'Switch to Reception'}
                </button>
              </div>

              {/* Host Employee Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                currentUser.role === 'host' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-300' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Employee / Host</span>
                  <Building className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Receive notifications upon guest arrivals, review pending approvals, pre-register visitors.
                </p>
                <button
                  onClick={() => switchRole('host')}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentUser.role === 'host'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentUser.role === 'host' ? 'Active Account' : 'Switch to Host'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Host Modal */}
      {showAddHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Add New Host / Employee</h3>
              <button
                onClick={() => setShowAddHostModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newHostName}
                  onChange={(e) => setNewHostName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya.lin@nexus.corp"
                  value={newHostEmail}
                  onChange={(e) => setNewHostEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newHostDept}
                    onChange={(e) => setNewHostDept(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Enterprise Sales">Enterprise Sales</option>
                    <option value="Facilities & Security">Facilities & Security</option>
                    <option value="Finance & Legal">Finance & Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Architect"
                    value={newHostDesignation}
                    onChange={(e) => setNewHostDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newHostPhone}
                    onChange={(e) => setNewHostPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Office / Desk Room
                  </label>
                  <input
                    type="text"
                    placeholder="Suite 302"
                    value={newHostRoom}
                    onChange={(e) => setNewHostRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddHostModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Add Host
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
