import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Plus, Command } from 'lucide-react';

export const WorkspaceRail: React.FC = () => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, theme } = useSlackStore();

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

        {/* Add Workspace Button */}
        <button className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 hover:border-white/50 text-white/60 hover:text-white flex items-center justify-center transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
