import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import {
  Hash,
  Lock,
  MessageSquare,
  Bookmark,
  FileText,
  Plus,
  Headphones,
  ChevronDown,
  Search,
  ShieldCheck,
  Share2,
  Zap,
} from 'lucide-react';
import { UserFooter } from './UserFooter';

export const ChannelSidebar: React.FC = () => {
  const {
    workspaces,
    activeWorkspaceId,
    channels,
    activeChannelId,
    setActiveChannel,
    users,
    theme,
    startHuddle,
    huddleState,
    setSearchOpen,
    currentUser,
    setOwnerDashboardOpen,
    setInviteModalOpen,
    setDevAdminPanelOpen,
  } = useSlackStore();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const getSidebarBg = () => {
    switch (theme) {
      case 'nocturne':
        return 'bg-slate-900 border-slate-800 text-slate-200';
      case 'light':
        return 'bg-slate-100 border-slate-200 text-slate-800';
      case 'goth':
        return 'bg-neutral-900 border-neutral-800 text-neutral-200';
      default: // aubergine
        return 'bg-[#350d36] border-purple-900/40 text-purple-100';
    }
  };

  const getActiveItemStyle = () => {
    switch (theme) {
      case 'light':
        return 'bg-slate-200 text-slate-900 font-semibold';
      default:
        return 'bg-[#1164A3] text-white font-medium shadow-sm';
    }
  };

  const publicChannels = channels.filter((c) => c.type !== 'dm');
  const isDeveloper = currentUser?.role === 'developer';
  const isOwnerOrManager = currentUser?.role === 'owner' || currentUser?.role === 'manager';
  const pendingCount = users.filter((u) => !u.isApproved).length;

  return (
    <aside className={`w-64 flex flex-col h-full border-r select-none flex-shrink-0 ${getSidebarBg()}`}>
      {/* Workspace Header */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between font-bold text-lg cursor-pointer hover:bg-white/5 transition-all">
        <div className="flex items-center space-x-2 truncate">
          <span className="truncate">{activeWorkspace.name}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/80"
          title="Search Workspace (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar Content Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {/* Developer Admin / Owner Buttons */}
        <div className="space-y-1">
          {isDeveloper && (
            <button
              onClick={() => setDevAdminPanelOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 text-purple-100 text-xs font-black transition-all shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Developer Admin Panel</span>
              </div>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {(isOwnerOrManager || isDeveloper) && (
            <button
              onClick={() => setOwnerDashboardOpen(true)}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Owner & Manager Room</span>
            </button>
          )}

          <button
            onClick={() => setInviteModalOpen(true)}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Copy Workspace Invite Link</span>
          </button>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-0.5 text-sm font-medium">
          <button className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md hover:bg-white/10 transition-all opacity-80 hover:opacity-100">
            <MessageSquare className="w-4 h-4" />
            <span>Threads</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md hover:bg-white/10 transition-all opacity-80 hover:opacity-100">
            <Bookmark className="w-4 h-4" />
            <span>Saved items</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-md hover:bg-white/10 transition-all opacity-80 hover:opacity-100">
            <FileText className="w-4 h-4" />
            <span>Canvas Docs</span>
          </button>
        </div>

        {/* Huddle Quick Banner */}
        <div className="px-1">
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300">Voice Huddle</p>
                <p className="text-[11px] opacity-70">
                  {huddleState.active ? 'Huddle Active' : 'Start audio lounge'}
                </p>
              </div>
            </div>
            {!huddleState.active && (
              <button
                onClick={() => startHuddle('chn-general', 'general')}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-all"
              >
                Join
              </button>
            )}
          </div>
        </div>

        {/* Channels Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider opacity-60">
            <span>Channels</span>
            <button className="hover:opacity-100 p-0.5 rounded hover:bg-white/10">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-0.5 pt-1">
            {publicChannels.map((chn) => {
              const isActive = chn.id === activeChannelId;
              return (
                <button
                  key={chn.id}
                  onClick={() => {
                    if (chn.name === 'developer-admin-room' && !isDeveloper) {
                      alert('This channel is restricted to the Developer Super Admin.');
                      return;
                    }
                    if (chn.name === 'owner-manager-room' && !isOwnerOrManager && !isDeveloper) {
                      alert('This room is restricted to Workspace Owners and Managers.');
                      return;
                    }
                    setActiveChannel(chn.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-all ${
                    isActive ? getActiveItemStyle() : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {chn.type === 'private' ? (
                      <Lock className="w-4 h-4 text-amber-400 opacity-90" />
                    ) : (
                      <Hash className="w-4 h-4 opacity-70" />
                    )}
                    <span className="truncate">{chn.name}</span>
                  </div>
                  {chn.unreadCount ? (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {chn.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider opacity-60">
            <span>Team Members ({users.length})</span>
          </div>
          <div className="space-y-0.5 pt-1">
            {users.map((member) => {
              return (
                <div
                  key={member.id}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm hover:bg-white/10 opacity-90 hover:opacity-100 transition-all"
                >
                  <div className="flex items-center space-x-2.5 truncate min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={member.avatarUrl}
                        alt={member.displayName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-purple-950 ${
                          member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <span className="truncate text-xs font-semibold">{member.displayName}</span>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold ${
                      member.role === 'developer'
                        ? 'bg-purple-500/20 text-purple-300'
                        : member.role === 'owner'
                        ? 'bg-amber-500/20 text-amber-300'
                        : member.role === 'manager'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integrated User Profile Footer */}
      <UserFooter />
    </aside>
  );
};
