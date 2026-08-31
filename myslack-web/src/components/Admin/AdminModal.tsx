import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { ShieldCheck, Users, MessageSquare, HardDrive, X, Activity, UserCheck, UserX } from 'lucide-react';

export const AdminModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { users } = useSlackStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'audit'>('analytics');

  if (!isOpen) return null;

  const auditLogs = [
    { id: 1, action: 'USER_ROLE_UPDATED', admin: 'BS Jamwal', details: 'Assigned Sarah Connor to Admin role', timestamp: '2 hours ago' },
    { id: 2, action: 'CHANNEL_ARCHIVED', admin: 'BS Jamwal', details: 'Archived channel #legacy-v1', timestamp: 'Yesterday at 4:15 PM' },
    { id: 3, action: 'WORKSPACE_SETTINGS_CHANGED', admin: 'BS Jamwal', details: 'Updated workspace theme defaults', timestamp: '3 days ago' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Workspace Administration & Analytics</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-800 flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Analytics Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            User Management & Roles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-indigo-400">
                  <Users className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20">Active</span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-100">48</p>
                  <p className="text-xs text-slate-400 mt-1">Total Workspace Users</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20">+12%</span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-100">1,420</p>
                  <p className="text-xs text-slate-400 mt-1">Total Messages Sent</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <HardDrive className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20">Storage</span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-100">142.8 MB</p>
                  <p className="text-xs text-slate-400 mt-1">Total Storage Consumed</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Members</p>
              <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-all">
                    <div className="flex items-center space-x-3">
                      <img src={u.avatarUrl} alt={u.displayName} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-100">{u.displayName}</p>
                        <p className="text-xs text-slate-400">@{u.username} • {u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                        {u.id === 'usr-1' ? 'Workspace Owner' : 'Member'}
                      </span>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                      >
                        {u.status === 'active' ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <UserX className="w-4 h-4 text-rose-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Log History</p>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-extrabold text-indigo-300">{log.action}</span>
                        <span className="text-[11px] text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{log.details}</p>
                      <p className="text-xs text-slate-400">Admin: {log.admin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
