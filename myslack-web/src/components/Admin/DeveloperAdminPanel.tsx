import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import {
  Zap,
  CheckCircle,
  XCircle,
  UserCheck,
  ShieldAlert,
  Sliders,
  Users,
  X,
  Lock,
  Unlock,
  FolderPlus,
  Briefcase,
  PlusCircle,
  UserMinus,
  Hash,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import type { UserRole, UserPermissions } from '../../types';

export const DeveloperAdminPanel: React.FC = () => {
  const {
    isDevAdminPanelOpen,
    setDevAdminPanelOpen,
    users,
    approveUser,
    rejectUser,
    updateUserRole,
    updateRoleCategoryPermissions,
    projects,
    createProject,
    assignUserToProject,
    removeUserFromProject,
    createChannel,
    securityAlerts,
  } = useSlackStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'authority' | 'projects' | 'users' | 'security'>('pending');

  // New Project Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedMembersForProject, setSelectedMembersForProject] = useState<string[]>([]);

  // New Channel Form state inside Project
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedProjectIdForChannel, setSelectedProjectIdForChannel] = useState('');

  if (!isDevAdminPanelOpen) return null;

  const pendingUsers = users.filter((u) => !u.isApproved);
  const approvedUsers = users.filter((u) => u.isApproved);

  const handleToggleRoleCategoryPermission = (roleCategory: UserRole, key: keyof UserPermissions, currentValue: boolean) => {
    updateRoleCategoryPermissions(roleCategory, { [key]: !currentValue });
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    createProject(newProjectName, newProjectDesc, selectedMembersForProject);
    setNewProjectName('');
    setNewProjectDesc('');
    setSelectedMembersForProject([]);
  };

  const handleCreateProjectChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !selectedProjectIdForChannel) return;
    createChannel(newChannelName, 'public', `Project Channel for ${newChannelName}`, selectedProjectIdForChannel);
    setNewChannelName('');
  };

  const authoritiesList: { key: keyof UserPermissions; label: string; desc: string }[] = [
    { key: 'canAssignJobs', label: 'Can Assign Jobs & Tasks', desc: 'Allows assigning work orders to team members' },
    { key: 'canViewActivityLogs', label: 'Can View Employee Software & Time Logs', desc: 'Allows viewing live active software and online duration' },
    { key: 'canManageChannels', label: 'Can Create & Manage Channels', desc: 'Allows creating public and private team rooms' },
    { key: 'canManageRoles', label: 'Can Delegate Authority to Lower Roles', desc: 'Allows promoting/demoting subordinate member roles' },
    { key: 'canApproveUsers', label: 'Can Confirm New Registration Signups', desc: 'Allows confirming pending registration signups into workspace' },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <span>Developer Super Admin Panel</span>
                <span className="px-2.5 py-0.5 text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full uppercase tracking-wider">
                  Supreme Authority
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Grant role authorities, confirm signups, manage projects & monitor security IP alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setDevAdminPanelOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pending Signups ({pendingUsers.length})</span>
            {pendingUsers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-bounce">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'security'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Security IP Alerts ({securityAlerts.length})</span>
            {securityAlerts.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {securityAlerts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('authority')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'authority'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Role Authority Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'projects'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Projects & Team Member Assignments</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all flex-shrink-0 ${
              activeTab === 'users'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Accounts ({approvedUsers.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PENDING REGISTRATIONS */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Account Registration Confirmations</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Developer must accept pending signups into Owner, Manager, or Employee categories.
                </p>
              </div>

              {pendingUsers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2 text-slate-400">
                  <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
                  <p className="text-sm font-semibold text-slate-200">No pending account signups</p>
                  <p className="text-xs opacity-70">
                    All registration requests have been confirmed into their respective roles.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((pUser) => (
                    <div
                      key={pUser.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={pUser.avatarUrl}
                          alt={pUser.displayName}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-500/40"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-white text-base">{pUser.displayName}</h4>
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md">
                              Requested: {pUser.role.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{pUser.email}</p>
                          <p className="text-xs text-indigo-300 font-mono mt-1 flex items-center space-x-2">
                            <span>Task: {pUser.currentTask || 'None specified'}</span>
                            {pUser.lastKnownIp && (
                              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                IP: {pUser.lastKnownIp}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs text-slate-400 mr-2 font-semibold">Confirm Category:</span>
                        <button
                          onClick={() => approveUser(pUser.id, 'owner')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all"
                        >
                          Approve as Owner
                        </button>
                        <button
                          onClick={() => approveUser(pUser.id, 'manager')}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/40 font-bold text-xs transition-all"
                        >
                          Approve as Manager
                        </button>
                        <button
                          onClick={() => approveUser(pUser.id, 'employee')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all"
                        >
                          Approve as Employee
                        </button>
                        <button
                          onClick={() => rejectUser(pUser.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SECURITY IP ALERTS LOG */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-300 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Unauthorized Developer Mode Attempts & IP Logs</span>
                </h3>
                <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                  {securityAlerts.length} Security Incident(s)
                </span>
              </div>

              {securityAlerts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2 text-slate-400">
                  <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
                  <p className="text-sm font-semibold text-slate-200">No security breaches detected</p>
                  <p className="text-xs opacity-70">
                    No unauthorized Developer Mode signup attempts or incorrect passcodes recorded.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2 text-rose-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-bold text-sm text-rose-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Attempted User: {alert.displayName} ({alert.userEmail})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {alert.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-rose-500/20">
                        <div className="flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          <span>IP: <strong className="text-white">{alert.ipAddress}</strong></span>
                        </div>
                        <div>
                          <span>Attempted Role: <strong className="text-amber-300">{alert.attemptedRole.toUpperCase()}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROLE AUTHORITY MATRIX */}
          {activeTab === 'authority' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Global Role Category Authority Delegation</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Developer can grant or revoke specific powers for **Owner**, **Manager**, and **Employee** roles across the entire platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(['owner', 'manager', 'employee'] as UserRole[]).map((rCategory) => (
                  <div key={rCategory} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          rCategory === 'owner'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : rCategory === 'manager'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {rCategory} Category Authorities
                      </span>
                    </div>

                    <div className="space-y-3">
                      {authoritiesList.map((authItem) => {
                        const roleMembers = users.filter((u) => u.role === rCategory);
                        const isGranted = roleMembers.length > 0
                          ? Boolean(roleMembers[0]?.permissions?.[authItem.key])
                          : false;

                        return (
                          <div key={authItem.key} className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200">{authItem.label}</span>
                              <button
                                onClick={() => handleToggleRoleCategoryPermission(rCategory, authItem.key, isGranted)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                                  isGranted
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                }`}
                              >
                                {isGranted ? 'Allowed' : 'Denied'}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400">{authItem.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS & TEAM MEMBER ASSIGNMENTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Form to create project */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FolderPlus className="w-4 h-4 text-indigo-400" />
                  <span>Create New Team Project & Assign Members</span>
                </h3>

                <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project Name (e.g. Mobile App Core, E-Commerce Suite)"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Project Description / Goals"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Assign Team Members to Project (Select Owners, Managers, Employees):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {approvedUsers.map((u) => {
                        const isSelected = selectedMembersForProject.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedMembersForProject(selectedMembersForProject.filter((id) => id !== u.id));
                              } else {
                                setSelectedMembersForProject([...selectedMembersForProject, u.id]);
                              }
                            }}
                            className={`p-2 rounded-xl border text-xs text-left flex items-center space-x-2 transition-all ${
                              isSelected
                                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <img src={u.avatarUrl} alt={u.displayName} className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate flex-1 font-semibold">{u.displayName} ({u.role})</span>
                            {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Project & Assign Members</span>
                  </button>
                </form>
              </div>

              {/* Create Channel in Project */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-emerald-400" />
                  <span>Create Project Channel</span>
                </h3>

                <form onSubmit={handleCreateProjectChannel} className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedProjectIdForChannel}
                    onChange={(e) => setSelectedProjectIdForChannel(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="">Select Project...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Channel Name (e.g. design-feedback, api-sprint)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Channel</span>
                  </button>
                </form>
              </div>

              {/* Active Projects List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Team Projects</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => {
                    const assignedMembers = approvedUsers.filter((u) => proj.assignedUserIds?.includes(u.id));
                    const unassignedMembers = approvedUsers.filter((u) => !proj.assignedUserIds?.includes(u.id));

                    return (
                      <div key={proj.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-white text-base flex items-center space-x-2">
                              <Briefcase className="w-4 h-4 text-indigo-400" />
                              <span>{proj.name}</span>
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">Created {proj.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                        </div>

                        {/* Assigned Members */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-300">
                            Assigned Members ({assignedMembers.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {assignedMembers.map((m) => (
                              <span
                                key={m.id}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              >
                                <img src={m.avatarUrl} alt={m.displayName} className="w-4 h-4 rounded-full" />
                                <span>{m.displayName} ({m.role})</span>
                                <button
                                  type="button"
                                  onClick={() => removeUserFromProject(proj.id, m.id)}
                                  className="text-slate-500 hover:text-rose-400 ml-1"
                                >
                                  <UserMinus className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Add Unassigned Members Dropdown */}
                        {unassignedMembers.length > 0 && (
                          <div className="pt-2 border-t border-slate-900 flex items-center space-x-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignUserToProject(proj.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="">+ Assign Team Member to {proj.name}...</option>
                              {unassignedMembers.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.displayName} ({u.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALL ACCOUNTS & CATEGORIES */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Manage All Accounts & Category Roles</h3>
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Current Category Role</th>
                      <th className="py-3 px-4">Approval Status</th>
                      <th className="py-3 px-4 text-right">Developer Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-800/40 transition-all">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img src={usr.avatarUrl} alt={usr.displayName} className="w-8 h-8 rounded-xl object-cover" />
                            <div>
                              <p className="font-bold text-white text-xs">{usr.displayName}</p>
                              <p className="text-[11px] text-slate-400">@{usr.username}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs font-mono text-slate-300">{usr.email}</td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                              usr.role === 'developer'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : usr.role === 'owner'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : usr.role === 'manager'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {usr.role}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {usr.isApproved ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Confirmed</span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <select
                            value={usr.role}
                            onChange={(e) => updateUserRole(usr.id, e.target.value as UserRole)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="developer">Developer</option>
                            <option value="owner">Owner</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
