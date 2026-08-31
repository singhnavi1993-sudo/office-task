import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Hash, Lock, Headphones, FileText, Search, User as UserIcon } from 'lucide-react';
import { ActiveTaskBar } from './ActiveTaskBar';

export const ChatHeader: React.FC = () => {
  const {
    channels,
    activeChannelId,
    users,
    startHuddle,
    huddleState,
    setCanvasOpen,
    isCanvasOpen,
    setSearchOpen,
    theme,
  } = useSlackStore();

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const isDM = activeChannel.type === 'dm';
  const dmUser = isDM ? users.find((u) => u.id === activeChannel.dmUserId) : null;

  const getHeaderBg = () => {
    switch (theme) {
      case 'nocturne':
        return 'bg-slate-900 border-slate-800 text-white';
      case 'light':
        return 'bg-white border-slate-200 text-slate-900';
      case 'goth':
        return 'bg-neutral-900 border-neutral-800 text-white';
      default:
        return 'bg-slate-900/50 backdrop-blur-md border-slate-800 text-slate-100';
    }
  };

  return (
    <div className="flex flex-col">
      <header
        className={`h-14 px-5 border-b flex items-center justify-between select-none ${getHeaderBg()}`}
      >
        {/* Title & Topic */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex items-center space-x-1.5 font-bold text-lg">
            {isDM ? (
              <UserIcon className="w-5 h-5 text-indigo-400" />
            ) : activeChannel.type === 'private' ? (
              <Lock className="w-5 h-5 text-amber-400" />
            ) : (
              <Hash className="w-5 h-5 text-slate-400" />
            )}
            <span className="truncate">{isDM ? dmUser?.displayName : activeChannel.name}</span>
          </div>

          {activeChannel.topic && (
            <>
              <span className="text-slate-600">|</span>
              <p className="text-xs text-slate-400 truncate max-w-md hidden md:block">
                {activeChannel.topic}
              </p>
            </>
          )}
        </div>

        {/* Action Buttons & Avatars */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Member Avatars Stack */}
          <div className="hidden lg:flex items-center -space-x-2 mr-2">
            {users.slice(0, 4).map((u) => (
              <img
                key={u.id}
                src={u.avatarUrl}
                alt={u.displayName}
                className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
              />
            ))}
            <span className="w-7 h-7 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border-2 border-slate-900 flex items-center justify-center">
              +{users.length}
            </span>
          </div>

          {/* Start / Join Huddle */}
          <button
            onClick={() => startHuddle(activeChannel.id, activeChannel.name)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              huddleState.active
                ? 'bg-emerald-500 text-white shadow-glow'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>{huddleState.active ? 'In Huddle' : 'Huddle'}</span>
          </button>

          {/* Toggle Canvas Drawer */}
          <button
            onClick={() => setCanvasOpen(!isCanvasOpen)}
            className={`p-2 rounded-lg text-xs font-medium border transition-all ${
              isCanvasOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle Workspace Canvas"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-xs text-slate-400 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search (Ctrl+K)</span>
          </button>
        </div>
      </header>

      {/* Active Task / Software Status Bar */}
      <ActiveTaskBar />
    </div>
  );
};
