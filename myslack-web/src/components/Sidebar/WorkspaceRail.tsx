import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Plus, Command, Building } from 'lucide-react';

export const WorkspaceRail: React.FC = () => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, theme, currentUser, createWorkspace } = useSlackStore();
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const canCreateCompany = currentUser?.role === 'developer' || Boolean(currentUser?.permissions?.canCreateWorkspaces);

  const getRailBg = () => {
    switch (theme) {
      case 'nocturne':
        return 'bg-slate-950 border-slate-800';
      case 'light':
        return 'bg-slate-200 border-slate-300';
      case 'goth':
        return 'bg-neutral-950 border-neutral-900';
      default: // aubergine
        return 'bg-[#3F0E40] border-purple-900/30';
    }
  };

  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    createWorkspace(newCompanyName.trim());
    setNewCompanyName('');
    setIsCreatingCompany(false);
  };

  return (
    <aside className={`w-18 flex flex-col items-center py-4 space-y-4 border-r flex-shrink-0 select-none ${getRailBg()}`}>
      {/* App Brand / Command Button */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-all">
        <Command className="w-6 h-6" />
      </div>

      <div className="w-8 h-[1px] bg-white/10 my-1" />

      {/* Workspaces List */}
      <div className="flex-1 w-full flex flex-col items-center space-y-3 overflow-y-auto">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          return (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              title={ws.name}
              className={`relative group w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'ring-2 ring-white shadow-xl scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute -left-3 top-2 bottom-2 w-1.5 bg-white rounded-r-full shadow-glow" />
              )}

              <img
                src={ws.iconUrl}
                alt={ws.name}
                className="w-full h-full rounded-xl object-cover"
              />

              {/* Unread badge */}
              {ws.unreadCount ? (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-purple-950">
                  {ws.unreadCount}
                </span>
              ) : null}
            </button>
          );
        })}

        {/* Add Workspace / Company Button */}
        <button
          onClick={() => {
            if (canCreateCompany) {
              setIsCreatingCompany(true);
            } else {
              alert('Permission Restricted: Only Developer or authorized Owners can create new company workspaces.');
            }
          }}
          title="Create New Company Workspace"
          className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 hover:border-white/50 text-white/60 hover:text-white flex items-center justify-center transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Create Company Modal */}
      {isCreatingCompany && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4 text-white">
            <div className="flex items-center space-x-2 font-bold text-lg text-indigo-300">
              <Building className="w-5 h-5" />
              <span>Create New Company Workspace</span>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Workspace Name</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp, Tech Solutions Ltd"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCompany(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
                >
                  Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
