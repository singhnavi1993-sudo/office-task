import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Settings, Smile, LogOut, RefreshCw } from 'lucide-react';

export const UserFooter: React.FC = () => {
  const { currentUser, setSettingsOpen, logout, clearAllData } = useSlackStore();

  if (!currentUser) return null;

  return (
    <div className="h-16 px-3 border-t border-white/10 flex items-center justify-between bg-black/10 select-none">
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="relative flex-shrink-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/20"
          />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-purple-950" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate leading-tight">{currentUser.displayName}</p>
          <p className="text-[11px] opacity-70 truncate flex items-center space-x-1">
            <Smile className="w-3 h-3 inline flex-shrink-0" />
            <span className="truncate">{currentUser.customStatus || 'Set a status'}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={clearAllData}
          className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all"
          title="Reset to Fresh Sign-Up Screen"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          title="Settings & Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
