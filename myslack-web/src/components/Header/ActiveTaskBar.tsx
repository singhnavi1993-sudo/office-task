import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Laptop, Edit2, Check, ShieldCheck, Share2, Zap } from 'lucide-react';

export const ActiveTaskBar: React.FC = () => {
  const {
    currentUser,
    updateCurrentTask,
    setOwnerDashboardOpen,
    setInviteModalOpen,
    setDevAdminPanelOpen,
    users,
  } = useSlackStore();
  const [isEditing, setIsEditing] = useState(false);
  const [taskInput, setTaskInput] = useState(currentUser?.currentTask || '');

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    updateCurrentTask(taskInput);
    setIsEditing(false);
  };

  const isDeveloper = currentUser.role === 'developer';
  const isOwnerOrManager = currentUser.role === 'owner' || currentUser.role === 'manager';
  const pendingCount = users.filter((u) => !u.isApproved).length;

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
      {/* Active Work / Software Status */}
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <span className="flex items-center space-x-1 font-semibold text-slate-400 flex-shrink-0">
          <Laptop className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Task:</span>
        </span>

        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center space-x-2 flex-1 max-w-md">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What software/task are you working on right now?"
              className="flex-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-mono text-[11px] truncate max-w-md transition-all group"
          >
            <span className="truncate">{currentUser.currentTask || 'Click to set active task/software...'}</span>
            <Edit2 className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Copy Invite Link</span>
        </button>

        {isDeveloper && (
          <button
            onClick={() => setDevAdminPanelOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 font-extrabold transition-all relative"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Developer Admin Panel</span>
            {pendingCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>
        )}

        {(isOwnerOrManager || isDeveloper) && (
          <button
            onClick={() => setOwnerDashboardOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner & Manager Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};
