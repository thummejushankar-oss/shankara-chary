import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Building2, Key } from 'lucide-react';
import { UserRole } from '../types/visitor';
import officeBannerImg from '../assets/images/office_campus_banner_1791622169513.jpg';

export const LoginPage: React.FC = () => {
  const { loginAs, showToast } = useVisitorContext();

  const [email, setEmail] = useState('reception@nexus.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both work email and credentials.');
      return;
    }

    if (email.toLowerCase().includes('admin')) {
      loginAs('admin');
    } else if (email.toLowerCase().includes('host') || email.toLowerCase().includes('chen')) {
      loginAs('host');
    } else {
      loginAs('receptionist');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Campus Image */}
      <img
        src={officeBannerImg}
        alt="Nexus Corporate Headquarters"
        className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />

      <div className="relative max-w-md w-full mx-auto space-y-6">
        {/* Logo & Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20 ring-4 ring-white/10">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            PassGuard Portal
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Visitor Management & Physical Security Console
          </p>
        </div>

        {/* Login Box */}
        <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
          {/* Quick Demo Logins Section */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => loginAs('receptionist')}
                className="p-2.5 rounded-xl border border-slate-700 hover:border-emerald-500 bg-slate-800/80 hover:bg-emerald-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-emerald-400">Reception</div>
                <div className="text-[10px] text-slate-400">Front Desk</div>
              </button>

              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="p-2.5 rounded-xl border border-slate-700 hover:border-blue-500 bg-slate-800/80 hover:bg-blue-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-blue-400">Admin</div>
                <div className="text-[10px] text-slate-400">Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => loginAs('host')}
                className="p-2.5 rounded-xl border border-slate-700 hover:border-purple-500 bg-slate-800/80 hover:bg-purple-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-purple-400">Host</div>
                <div className="text-[10px] text-slate-400">Employee</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or Sign In
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-900/40 border border-rose-800 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Sign In to Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Security Notice */}
        <div className="text-center text-[11px] text-slate-500">
          Nexus Security Compliance · ISO 27001 Certified · Encrypted Terminal
        </div>
      </div>
    </div>
  );
};
