import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { X, Palette, User, Check, LogOut } from 'lucide-react';
import type { SlackTheme } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    currentUser,
    setCurrentStatus,
    theme,
    setTheme,
    logout,
  } = useSlackStore();

  const [statusText, setStatusText] = useState(currentUser?.customStatus || '');

  if (!isSettingsOpen || !currentUser) return null;

  const themes: { id: SlackTheme; name: string; bg: string }[] = [
    { id: 'aubergine', name: 'Slack Aubergine (Dark)', bg: 'bg-[#3F0E40]' },
    { id: 'nocturne', name: 'Nocturne (Deep Slate)', bg: 'bg-slate-950' },
    { id: 'light', name: 'Clean Light', bg: 'bg-slate-200' },
  ];

  const statuses: { id: any; label: string; color: string }[] = [
    { id: 'active', label: 'Active', color: 'bg-emerald-500' },
    { id: 'away', label: 'Away', color: 'bg-amber-400' },
    { id: 'huddle', label: 'In a Huddle', color: 'bg-teal-400' },
    { id: 'dnd', label: 'Do Not Disturb', color: 'bg-rose-500' },
  ];

  const handleLogout = () => {
    setSettingsOpen(false);
    logout();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">Preferences & Profile</h3>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User Status Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Status & Presence</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStatus(s.id, statusText)}
                  className={`flex items-center space-x-2.5 p-3 rounded-2xl border transition-all text-sm font-medium ${
                    currentUser.status === s.id
                      ? 'bg-slate-800 border-indigo-500 text-slate-100 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Custom Status Message
              </label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => {
                  setStatusText(e.target.value);
                  setCurrentStatus(currentUser.status, e.target.value);
                }}
                placeholder="What is your focus today?"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Theme Selector Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-300">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Slack Workspace Theme</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                    theme === t.id
                      ? 'border-indigo-500 bg-slate-800 text-slate-100 shadow-md'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${t.bg} border border-white/20 mb-2 flex items-center justify-center`}
                  >
                    {theme === t.id && <Check className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-xs font-semibold text-center">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
