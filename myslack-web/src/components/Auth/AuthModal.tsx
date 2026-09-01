import React, { useState, useEffect } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { fetchClientIp } from '../../services/ipService';
import { Command, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Briefcase, Clock, Key, ShieldAlert } from 'lucide-react';
import type { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { login, register } = useSlackStore();
  const [isLoginTab, setIsLoginTab] = useState(false); // Default to Create Account Sign-up screen!
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientIp, setClientIp] = useState<string>('Detecting IP...');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [devPasscode, setDevPasscode] = useState('');
  const [currentTask, setCurrentTask] = useState('');

  // Fetch Client IP Address & sync central database users on component mount
  useEffect(() => {
    fetchClientIp().then((ip) => setClientIp(ip));
    useSlackStore.getState().syncUsersWithCentralDb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isLoginTab) {
      if (!email.trim()) return;
      // Sync central database users first so cross-device registered accounts are recognized!
      await useSlackStore.getState().syncUsersWithCentralDb();
      const res = login(email, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed. Please check your email.');
      }
    } else {
      if (!displayName.trim() || !email.trim()) return;
      
      const res = register(displayName, email, role, currentTask, devPasscode, clientIp);
      if (res.error) {
        setErrorMessage(res.error);
        if (res.pendingApproval) {
          setPendingNotice(displayName);
        }
      } else if (res.pendingApproval) {
        setPendingNotice(displayName);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1D21] flex items-center justify-center p-4 z-50 select-none overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
            <Command className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome to MySlack
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select Your Role Category & Join Workspace
            </p>
            <p className="text-[11px] text-indigo-400 font-mono mt-1">
              Client IP Address: {clientIp}
            </p>
          </div>
        </div>

        {/* Error / Security Alert Box */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>Security Restriction Enforced</span>
            </div>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Pending Confirmation Alert Box */}
        {pendingNotice ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-4 text-center">
            <Clock className="w-12 h-12 mx-auto text-amber-400 animate-pulse" />
            <h3 className="font-extrabold text-lg text-amber-300">Registration Submitted!</h3>
            <p className="text-xs leading-relaxed text-amber-200/90">
              Account registration for <strong>{pendingNotice}</strong> as <strong>{role.toUpperCase()}</strong> has been submitted.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-300 space-y-1">
              <p>⏳ Pending Developer Admin Confirmation</p>
              <p className="text-[11px] text-amber-200/80 font-normal">
                Your request has been logged. The Developer Admin must accept your account into the workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingNotice(null);
                setIsLoginTab(true);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Go to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="p-1 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false);
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  !isLoginTab ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account (Sign Up)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(true);
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  isLoginTab ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginTab && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Developer / Member Name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Select Role Category
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-500 transition-all"
                      >
                        <option value="employee">Employee (Requires Developer Approval)</option>
                        <option value="manager">Manager (Requires Developer Approval)</option>
                        <option value="owner">Owner (Requires Developer Approval)</option>
                        <option value="developer">Developer (Super Admin - Passcode Protected 🔒)</option>
                      </select>
                    </div>
                  </div>

                  {/* Developer Secret Key Input field */}
                  {role === 'developer' && (
                    <div className="p-3.5 rounded-2xl bg-purple-600/10 border border-purple-500/30 space-y-2">
                      <label className="text-xs font-bold text-purple-300 block flex items-center space-x-1.5">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Master Developer Passcode (Required for Developer Mode)</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={devPasscode}
                        onChange={(e) => setDevPasscode(e.target.value)}
                        placeholder="Enter Developer Passcode (e.g. DEV-SECRET-2026)"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-sm text-purple-100 placeholder-purple-400/50 font-mono focus:outline-none focus:border-purple-400"
                      />
                      <p className="text-[10px] text-purple-300/80">
                        🔒 Note: Entering an incorrect passcode logs your IP address ({clientIp}) and alerts the Developer.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Current Active Software / Task
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={currentTask}
                        onChange={(e) => setCurrentTask(e.target.value)}
                        placeholder="e.g. VS Code / System Architecture"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-600/25 mt-2"
              >
                <span>{isLoginTab ? 'Sign In to Workspace' : 'Create & Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
