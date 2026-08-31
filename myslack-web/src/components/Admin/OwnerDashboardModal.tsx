import React, { useState, useEffect } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import {
  ShieldCheck,
  Users,
  Clock,
  Briefcase,
  PlusCircle,
  X,
  AlertCircle,
  Copy,
  Check,
  Laptop,
} from 'lucide-react';
import type { UserRole } from '../../types';

export const OwnerDashboardModal: React.FC = () => {
  const {
    isOwnerDashboardOpen,
    setOwnerDashboardOpen,
    users,
    currentUser,
    jobs,
    assignJob,
    updateJobStatus,
    updateUserRole,
  } = useSlackStore();

  const [newJobTitle, setNewJobTitle] = useState('');
  const [selectedUserForJob, setSelectedUserForJob] = useState(users[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update timer every 30 seconds for accurate live online duration
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isOwnerDashboardOpen) return null;

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !selectedUserForJob) return;
    assignJob(newJobTitle, selectedUserForJob);
    setNewJobTitle('');
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?invite=ws-1`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper to format live online time duration
  const getOnlineDuration = (onlineSince?: string) => {
    if (!onlineSince) return 'Recently active';
    const start = new Date(onlineSince).getTime();
    const diffMs = Math.max(0, now.getTime() - start);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Online just now';
    if (diffMins < 60) return `${diffMins}m online`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m online`;
  };

  const activeOnlineCount = users.filter((u) => u.status === 'active').length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Owner & Manager Control Room</span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Admin Tracking
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Track live active software/tasks, online hours & assign team jobs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={() => setOwnerDashboardOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900/60 border-b border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Team Members</p>
              <p className="text-xl font-extrabold text-white">{users.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Online Right Now</p>
              <p className="text-xl font-extrabold text-emerald-400">{activeOnlineCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Jobs</p>
              <p className="text-xl font-extrabold text-amber-300">{jobs.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Your Role</p>
              <p className="text-sm font-bold text-purple-300 uppercase tracking-wider">{currentUser?.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: Member Active Software & Online Duration Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Laptop className="w-5 h-5 text-indigo-400" />
                <span>Live Employee Activity & Online Duration</span>
              </h3>
              <span className="text-xs text-slate-400">Updates live every 30 seconds</span>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Online Status & Time</th>
                    <th className="py-3 px-4">Current Active Software / Task</th>
                    <th className="py-3 px-4 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={member.avatarUrl}
                            alt={member.displayName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white leading-tight">{member.displayName}</p>
                            <p className="text-xs text-slate-400">@{member.username}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            member.role === 'owner'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : member.role === 'manager'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              member.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-200">
                              {member.status === 'active' ? 'Online' : 'Away'}
                            </p>
                            <p className="text-[11px] text-slate-400">{getOnlineDuration(member.onlineSince)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
                          {member.currentTask || 'No active task set'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {(currentUser?.role === 'owner' || currentUser?.role === 'developer') && member.id !== currentUser?.id ? (
                          <select
                            value={member.role}
                            onChange={(e) => updateUserRole(member.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                          >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="owner">Owner</option>
                          </select>
                        ) : (
                          <span className="text-xs text-slate-500">Fixed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Assign & Manage Jobs */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>Job Assignment & Task Tracking</span>
            </h3>

            {/* Create Job Form */}
            <form onSubmit={handleCreateJob} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                placeholder="Assign a new job/task (e.g. 'Build Contact Form UI', 'Fix Login API')"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <select
                value={selectedUserForJob}
                onChange={(e) => setSelectedUserForJob(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    Assign to: {u.displayName} ({u.role})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Job</span>
              </button>
            </form>

            {/* Jobs List */}
            <div className="space-y-2">
              {jobs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-sm font-semibold">No active jobs assigned yet.</p>
                  <p className="text-xs opacity-70">Use the form above to assign work to employees.</p>
                </div>
              ) : (
                jobs.map((job) => {
                  const assignedUser = users.find((u) => u.id === job.assignedToUserId);
                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            job.status === 'completed'
                              ? 'bg-emerald-500'
                              : job.status === 'in_progress'
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{job.title}</p>
                          <p className="text-xs text-slate-400">
                            Assigned to: <span className="text-indigo-300 font-semibold">{assignedUser?.displayName || 'Unknown User'}</span> • Created {job.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
