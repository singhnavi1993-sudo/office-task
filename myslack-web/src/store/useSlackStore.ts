import { create } from 'zustand';
import type { User, Workspace, Channel, Message, SlackTheme, HuddleState, UserRole, JobItem, UserPermissions, ProjectItem, SecurityAlert } from '../types';
import { INITIAL_USERS, INITIAL_WORKSPACES, INITIAL_CHANNELS, INITIAL_MESSAGES, INITIAL_PROJECTS, DEFAULT_PERMISSIONS } from '../mock/mockData';

const LOCAL_STORAGE_KEY = 'myslack_app_v7_workspace';
export const DEVELOPER_PASSCODE = 'DEV-SECRET-2026';

const loadStoredState = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load local state:', err);
  }
  return null;
};

const savedState = loadStoredState();

interface SlackStore {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (displayName: string, email: string, requestedRole: UserRole, currentTask?: string, devPasscode?: string, clientIp?: string) => { pendingApproval: boolean; error?: string };
  logout: () => void;

  // Security & IP Alerts
  securityAlerts: SecurityAlert[];
  recordSecurityBreach: (userEmail: string, displayName: string, attemptedRole: UserRole, ipAddress: string) => void;

  // Current user & Users
  currentUser: User | null;
  users: User[];
  updateCurrentTask: (task: string) => void;
  setCurrentStatus: (status: User['status'], customText?: string) => void;

  // Developer & Admin Authority Actions
  approveUser: (userId: string, assignedRole: UserRole) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole, passcode?: string) => { success: boolean; error?: string };
  updateUserPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  updateRoleCategoryPermissions: (role: UserRole, permissions: Partial<UserPermissions>) => void;

  // Projects & Team Assignments
  projects: ProjectItem[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  createProject: (name: string, description: string, assignedUserIds: string[]) => void;
  deleteProject: (projectId: string) => void;
  clearAllProjects: () => void;
  assignUserToProject: (projectId: string, userId: string) => void;
  removeUserFromProject: (projectId: string, userId: string) => void;

  // Workspaces / Companies
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
  renameWorkspace: (workspaceId: string, newName: string) => void;
  createWorkspace: (name: string) => void;

  channels: Channel[];
  activeChannelId: string;
  setActiveChannel: (id: string) => void;
  createChannel: (name: string, type: 'public' | 'private', topic?: string, projectId?: string) => void;

  // Messages & Threads
  messages: Message[];
  activeThreadMessageId: string | null;
  setActiveThreadMessage: (id: string | null) => void;
  sendMessage: (content: string, parentMessageId?: string, attachments?: any[]) => void;
  toggleReaction: (messageId: string, emoji: string) => void;

  // Jobs & Task Tracking
  jobs: JobItem[];
  assignJob: (title: string, assignedToUserId: string) => void;
  updateJobStatus: (jobId: string, newStatus: JobItem['status']) => void;

  // Huddles
  huddleState: HuddleState;
  startHuddle: (channelId: string, channelName: string) => void;
  endHuddle: () => void;
  toggleHuddleMute: () => void;
  toggleHuddleVideo: () => void;
  toggleHuddleScreenShare: () => void;

  // Modals & Dashboard States
  isDevAdminPanelOpen: boolean;
  setDevAdminPanelOpen: (open: boolean) => void;

  isOwnerDashboardOpen: boolean;
  setOwnerDashboardOpen: (open: boolean) => void;

  isInviteModalOpen: boolean;
  setInviteModalOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  isCanvasOpen: boolean;
  setCanvasOpen: (open: boolean) => void;
  canvasContent: string;
  setCanvasContent: (content: string) => void;

  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  theme: SlackTheme;
  setTheme: (theme: SlackTheme) => void;
  clearAllData: () => void;
}

export const useSlackStore = create<SlackStore>((set, get) => {
  const saveState = (newState: Partial<SlackStore>) => {
    try {
      const stateToSave = {
        users: newState.users || get().users,
        currentUser: newState.currentUser || get().currentUser,
        channels: newState.channels || get().channels,
        messages: newState.messages || get().messages,
        jobs: newState.jobs || get().jobs,
        projects: newState.projects || get().projects,
        workspaces: newState.workspaces || get().workspaces,
        securityAlerts: newState.securityAlerts || get().securityAlerts,
        isAuthenticated: newState.isAuthenticated !== undefined ? newState.isAuthenticated : get().isAuthenticated,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('LocalStorage write failed:', err);
    }
  };

  const initialUserList: User[] = savedState?.users || INITIAL_USERS;
  const initialCurrent: User | null = savedState?.currentUser || null;
  const initialChannels = savedState?.channels || INITIAL_CHANNELS;
  const initialMessages = savedState?.messages || INITIAL_MESSAGES;
  const initialJobs: JobItem[] = savedState?.jobs || [];
  const initialProjects: ProjectItem[] = savedState?.projects || INITIAL_PROJECTS;
  const initialWorkspaces: Workspace[] = savedState?.workspaces || INITIAL_WORKSPACES;
  const initialSecurityAlerts: SecurityAlert[] = savedState?.securityAlerts || [];

  return {
    isAuthenticated: savedState?.isAuthenticated && savedState?.currentUser?.isApproved ? true : false,
    securityAlerts: initialSecurityAlerts,

    recordSecurityBreach: (userEmail, displayName, attemptedRole, ipAddress) => {
      const state = get();
      const newAlert: SecurityAlert = {
        id: `alert-${Date.now()}`,
        userEmail,
        displayName,
        attemptedRole,
        ipAddress,
        userAgent: navigator.userAgent,
        timestamp: new Date().toLocaleString(),
        status: 'blocked',
      };
      const updatedAlerts = [newAlert, ...state.securityAlerts];
      set({ securityAlerts: updatedAlerts });
      saveState({ securityAlerts: updatedAlerts });

      const devChannel = state.channels.find((c) => c.name === 'developer-admin-room') || state.channels[0];
      const securityMsg: Message = {
        id: `msg-sec-${Date.now()}`,
        channelId: devChannel.id,
        userId: 'sys-security',
        userName: '🚨 SECURITY MONITOR',
        userAvatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=256&q=80',
        content: `🚨 **UNAUTHORIZED DEVELOPER ACCESS ATTEMPT BLOCKED**\n\n- **User**: ${displayName} (${userEmail})\n- **Attempted Role**: \`${attemptedRole.toUpperCase()}\`\n- **Client IP Address**: \`${ipAddress}\`\n- **Time**: ${newAlert.timestamp}\n- **Action Taken**: Developer role blocked. Account demoted to Employee (Pending Developer Confirmation).`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [{ emoji: '🚨', count: 1, users: ['sys-security'] }],
      };
      set({ messages: [...get().messages, securityMsg] });
      saveState({ messages: get().messages });
    },

    login: (email) => {
      const state = get();
      const foundUser = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        return { success: false, message: 'Account not found. Please click "Create Account" to register.' };
      }

      if (!foundUser.isApproved) {
        return {
          success: false,
          message: `Your registration as ${foundUser.role.toUpperCase()} is pending Developer Admin approval.`,
        };
      }

      const updatedUser: User = {
        ...foundUser,
        onlineSince: new Date().toISOString(),
        status: 'active',
      };
      const updatedUsers = state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));

      set({ isAuthenticated: true, currentUser: updatedUser, users: updatedUsers });
      saveState({ isAuthenticated: true, currentUser: updatedUser, users: updatedUsers });
      return { success: true };
    },

    register: (displayName, email, requestedRole, currentTask, devPasscode, clientIp = 'Unknown IP') => {
      const state = get();
      const isDeveloperRole = requestedRole === 'developer';

      if (isDeveloperRole) {
        if (!devPasscode || devPasscode !== DEVELOPER_PASSCODE) {
          get().recordSecurityBreach(email, displayName, requestedRole, clientIp);

          const demotedUser: User = {
            id: `usr-${Date.now()}`,
            username: displayName.toLowerCase().replace(/\s+/g, '_'),
            displayName,
            email,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
            role: 'employee',
            isApproved: false,
            permissions: { ...DEFAULT_PERMISSIONS.employee },
            currentTask: currentTask || 'Unauthorized Developer Attempt Logged',
            onlineSince: new Date().toISOString(),
            joinedAt: new Date().toISOString(),
            status: 'active',
            customStatus: '🚨 Flagged Account (Blocked Developer Attempt)',
            lastKnownIp: clientIp,
          };
          const updatedUsers = [...state.users, demotedUser];
          set({ users: updatedUsers });
          saveState({ users: updatedUsers });

          return {
            pendingApproval: true,
            error: `🚨 Incorrect Developer Security Passcode! Security alert logged from IP ${clientIp}. Registration fallback to Employee (Pending Approval).`,
          };
        }
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        username: displayName.toLowerCase().replace(/\s+/g, '_'),
        displayName,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        role: requestedRole,
        isApproved: isDeveloperRole,
        permissions: { ...DEFAULT_PERMISSIONS[requestedRole] },
        currentTask: currentTask || 'Active in workspace',
        onlineSince: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        status: 'active',
        customStatus: isDeveloperRole ? '⚡ Lead Developer Admin' : '⏳ Pending Confirmation',
        lastKnownIp: clientIp,
      };

      const updatedUsers = [...state.users, newUser];

      if (isDeveloperRole) {
        set({ isAuthenticated: true, currentUser: newUser, users: updatedUsers });
        saveState({ isAuthenticated: true, currentUser: newUser, users: updatedUsers });
        return { pendingApproval: false };
      } else {
        set({ users: updatedUsers });
        saveState({ users: updatedUsers });
        return { pendingApproval: true };
      }
    },

    logout: () => {
      set({ isAuthenticated: false, currentUser: null });
      saveState({ isAuthenticated: false, currentUser: null });
    },

    currentUser: initialCurrent,
    users: initialUserList,

    updateCurrentTask: (task) => {
      const state = get();
      if (!state.currentUser) return;
      const updatedUser = { ...state.currentUser, currentTask: task };
      const updatedUsers = state.users.map((u) => (u.id === state.currentUser!.id ? updatedUser : u));
      set({ currentUser: updatedUser, users: updatedUsers });
      saveState({ currentUser: updatedUser, users: updatedUsers });
    },

    setCurrentStatus: (status, customText) => {
      const state = get();
      if (!state.currentUser) return;
      const updatedUser: User = {
        ...state.currentUser,
        status,
        customStatus: customText !== undefined ? customText : state.currentUser.customStatus,
      };
      const updatedUsers = state.users.map((u) => (u.id === state.currentUser!.id ? updatedUser : u));
      set({ currentUser: updatedUser, users: updatedUsers });
      saveState({ currentUser: updatedUser, users: updatedUsers });
    },

    approveUser: (userId, assignedRole) => {
      const state = get();
      const updatedUsers = state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              isApproved: true,
              role: assignedRole,
              permissions: { ...DEFAULT_PERMISSIONS[assignedRole] },
              customStatus: `🟢 Approved ${assignedRole.toUpperCase()}`,
            }
          : u
      );
      set({ users: updatedUsers });
      saveState({ users: updatedUsers });
    },

    rejectUser: (userId) => {
      const state = get();
      const updatedUsers = state.users.filter((u) => u.id !== userId);
      set({ users: updatedUsers });
      saveState({ users: updatedUsers });
    },

    deleteUser: (userId) => {
      const state = get();
      const updatedUsers = state.users.filter((u) => u.id !== userId);
      let updatedCurrent = state.currentUser;
      if (state.currentUser && state.currentUser.id === userId) {
        updatedCurrent = null;
      }
      set({ users: updatedUsers, currentUser: updatedCurrent, isAuthenticated: updatedCurrent ? state.isAuthenticated : false });
      saveState({ users: updatedUsers, currentUser: updatedCurrent, isAuthenticated: updatedCurrent ? state.isAuthenticated : false });
    },

    updateUserRole: (userId, newRole, passcode) => {
      const state = get();
      if (newRole === 'developer' && passcode !== DEVELOPER_PASSCODE) {
        return { success: false, error: 'Incorrect Developer Security Passcode!' };
      }

      const updatedUsers = state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: newRole,
              permissions: { ...DEFAULT_PERMISSIONS[newRole] },
            }
          : u
      );
      let updatedCurrent = state.currentUser;
      if (state.currentUser && state.currentUser.id === userId) {
        updatedCurrent = { ...state.currentUser, role: newRole, permissions: { ...DEFAULT_PERMISSIONS[newRole] } };
      }
      set({ users: updatedUsers, currentUser: updatedCurrent });
      saveState({ users: updatedUsers, currentUser: updatedCurrent });
      return { success: true };
    },

    updateUserPermissions: (userId, partialPermissions) => {
      const state = get();
      const updatedUsers = state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              permissions: { ...(u.permissions || DEFAULT_PERMISSIONS[u.role]), ...partialPermissions },
            }
          : u
      );
      let updatedCurrent = state.currentUser;
      if (state.currentUser && state.currentUser.id === userId) {
        updatedCurrent = { ...state.currentUser, permissions: { ...(state.currentUser.permissions || DEFAULT_PERMISSIONS[state.currentUser.role]), ...partialPermissions } };
      }
      set({ users: updatedUsers, currentUser: updatedCurrent });
      saveState({ users: updatedUsers, currentUser: updatedCurrent });
    },

    updateRoleCategoryPermissions: (roleCategory, partialPermissions) => {
      const state = get();
      DEFAULT_PERMISSIONS[roleCategory] = { ...DEFAULT_PERMISSIONS[roleCategory], ...partialPermissions };

      const updatedUsers = state.users.map((u) =>
        u.role === roleCategory
          ? { ...u, permissions: { ...(u.permissions || DEFAULT_PERMISSIONS[roleCategory]), ...partialPermissions } }
          : u
      );
      let updatedCurrent = state.currentUser;
      if (state.currentUser && state.currentUser.role === roleCategory) {
        updatedCurrent = { ...state.currentUser, permissions: { ...(state.currentUser.permissions || DEFAULT_PERMISSIONS[roleCategory]), ...partialPermissions } };
      }
      set({ users: updatedUsers, currentUser: updatedCurrent });
      saveState({ users: updatedUsers, currentUser: updatedCurrent });
    },

    projects: initialProjects,
    activeProjectId: null,
    setActiveProjectId: (id) => set({ activeProjectId: id }),

    createProject: (name, description, assignedUserIds) => {
      const state = get();
      const newProject: ProjectItem = {
        id: `proj-${Date.now()}`,
        name,
        description,
        createdById: state.currentUser?.id || 'usr-dev-1',
        assignedUserIds,
        createdAt: new Date().toLocaleDateString(),
      };
      const updatedProjects = [newProject, ...state.projects];
      set({ projects: updatedProjects });
      saveState({ projects: updatedProjects });

      const channelName = `${name.toLowerCase().replace(/\s+/g, '-')}-general`;
      get().createChannel(channelName, 'public', `Official channel for project ${name}`, newProject.id);
    },

    deleteProject: (projectId) => {
      const state = get();
      const updatedProjects = state.projects.filter((p) => p.id !== projectId);
      set({ projects: updatedProjects });
      saveState({ projects: updatedProjects });
    },

    clearAllProjects: () => {
      set({ projects: [] });
      saveState({ projects: [] });
    },

    assignUserToProject: (projectId, userId) => {
      const state = get();
      const updatedProjects = state.projects.map((p) =>
        p.id === projectId && !p.assignedUserIds.includes(userId)
          ? { ...p, assignedUserIds: [...p.assignedUserIds, userId] }
          : p
      );
      set({ projects: updatedProjects });
      saveState({ projects: updatedProjects });
    },

    removeUserFromProject: (projectId, userId) => {
      const state = get();
      const updatedProjects = state.projects.map((p) =>
        p.id === projectId
          ? { ...p, assignedUserIds: p.assignedUserIds.filter((id) => id !== userId) }
          : p
      );
      set({ projects: updatedProjects });
      saveState({ projects: updatedProjects });
    },

    // Workspaces / Companies
    workspaces: initialWorkspaces,
    activeWorkspaceId: initialWorkspaces[0]?.id || 'ws-1',
    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

    renameWorkspace: (workspaceId, newName) => {
      const state = get();
      const updatedWorkspaces = state.workspaces.map((ws) =>
        ws.id === workspaceId ? { ...ws, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-') } : ws
      );
      set({ workspaces: updatedWorkspaces });
      saveState({ workspaces: updatedWorkspaces });
    },

    createWorkspace: (name) => {
      const state = get();
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
        unreadCount: 0,
      };
      const updatedWorkspaces = [...state.workspaces, newWorkspace];
      set({ workspaces: updatedWorkspaces, activeWorkspaceId: newWorkspace.id });
      saveState({ workspaces: updatedWorkspaces });

      // Create default general channel for new company
      get().createChannel('general', 'public', `General channel for ${name}`);
    },

    channels: initialChannels,
    activeChannelId: initialChannels[0].id,
    setActiveChannel: (id) => set({ activeChannelId: id }),

    createChannel: (name, type, topic, projectId) => {
      const state = get();
      const newChannel: Channel = {
        id: `chn-${Date.now()}`,
        workspaceId: state.activeWorkspaceId,
        projectId: projectId,
        name: name.toLowerCase().replace(/\s+/g, '-'),
        type,
        topic: topic || '',
        membersCount: state.users.length,
      };
      const updatedChannels = [...state.channels, newChannel];
      set({ channels: updatedChannels, activeChannelId: newChannel.id });
      saveState({ channels: updatedChannels });
    },

    messages: initialMessages,
    activeThreadMessageId: null,
    setActiveThreadMessage: (id) => set({ activeThreadMessageId: id }),

    sendMessage: (content, parentMessageId, attachments) => {
      const state = get();
      if (!state.currentUser) return;
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        channelId: state.activeChannelId,
        userId: state.currentUser.id,
        userName: state.currentUser.displayName,
        userAvatar: state.currentUser.avatarUrl,
        content,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentMessageId,
        reactions: [],
        attachments: attachments || [],
      };

      let updatedMessages = [...state.messages];
      if (parentMessageId) {
        updatedMessages = updatedMessages.map((m) =>
          m.id === parentMessageId
            ? { ...m, replyCount: (m.replyCount || 0) + 1, lastReplyAt: newMsg.createdAt }
            : m
        );
      }
      const finalMessages = [...updatedMessages, newMsg];
      set({ messages: finalMessages });
      saveState({ messages: finalMessages });
    },

    toggleReaction: (messageId, emoji) => {
      const state = get();
      if (!state.currentUser) return;
      const updatedMessages = state.messages.map((msg) => {
        if (msg.id !== messageId) return msg;
        const currentUserId = state.currentUser!.id;
        const existingRx = msg.reactions.find((r) => r.emoji === emoji);

        let newReactions = [...msg.reactions];
        if (existingRx) {
          if (existingRx.users.includes(currentUserId)) {
            const newUsers = existingRx.users.filter((u) => u !== currentUserId);
            if (newUsers.length === 0) {
              newReactions = newReactions.filter((r) => r.emoji !== emoji);
            } else {
              newReactions = newReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r
              );
            }
          } else {
            newReactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, currentUserId] } : r
            );
          }
        } else {
          newReactions.push({ emoji, count: 1, users: [currentUserId] });
        }

        return { ...msg, reactions: newReactions };
      });

      set({ messages: updatedMessages });
      saveState({ messages: updatedMessages });
    },

    jobs: initialJobs,
    assignJob: (title, assignedToUserId) => {
      const state = get();
      if (!state.currentUser) return;
      const newJob: JobItem = {
        id: `job-${Date.now()}`,
        title,
        assignedToUserId,
        assignedByUserId: state.currentUser.id,
        status: 'pending',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedJobs = [newJob, ...state.jobs];
      set({ jobs: updatedJobs });
      saveState({ jobs: updatedJobs });

      const targetUser = state.users.find((u) => u.id === assignedToUserId);
      const targetChannel = state.channels.find((c) => c.name === 'job-updates') || state.channels[0];

      const newMsg: Message = {
        id: `msg-job-${Date.now()}`,
        channelId: targetChannel.id,
        userId: state.currentUser.id,
        userName: state.currentUser.displayName,
        userAvatar: state.currentUser.avatarUrl,
        content: `📋 **New Job Assigned**: "${title}" assigned to @${targetUser?.displayName || 'Employee'}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [{ emoji: '💼', count: 1, users: [state.currentUser.id] }],
      };
      set({ messages: [...get().messages, newMsg] });
      saveState({ messages: get().messages });
    },

    updateJobStatus: (jobId, newStatus) => {
      const state = get();
      const updatedJobs = state.jobs.map((j) =>
        j.id === jobId ? { ...j, status: newStatus, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : j
      );
      set({ jobs: updatedJobs });
      saveState({ jobs: updatedJobs });
    },

    huddleState: {
      active: false,
      isMuted: false,
      isVideoOn: false,
      isScreenSharing: false,
      participants: [],
    },
    startHuddle: (channelId, channelName) =>
      set((state) => ({
        huddleState: {
          active: true,
          channelId,
          channelName,
          isMuted: false,
          isVideoOn: false,
          isScreenSharing: false,
          participants: state.currentUser ? [state.currentUser] : [],
        },
      })),
    endHuddle: () =>
      set({
        huddleState: {
          active: false,
          isMuted: false,
          isVideoOn: false,
          isScreenSharing: false,
          participants: [],
        },
      }),
    toggleHuddleMute: () =>
      set((state) => ({
        huddleState: { ...state.huddleState, isMuted: !state.huddleState.isMuted },
      })),
    toggleHuddleVideo: () =>
      set((state) => ({
        huddleState: { ...state.huddleState, isVideoOn: !state.huddleState.isVideoOn },
      })),
    toggleHuddleScreenShare: () =>
      set((state) => ({
        huddleState: { ...state.huddleState, isScreenSharing: !state.huddleState.isScreenSharing },
      })),

    isDevAdminPanelOpen: false,
    setDevAdminPanelOpen: (open) => set({ isDevAdminPanelOpen: open }),

    isOwnerDashboardOpen: false,
    setOwnerDashboardOpen: (open) => set({ isOwnerDashboardOpen: open }),

    isInviteModalOpen: false,
    setInviteModalOpen: (open) => set({ isInviteModalOpen: open }),

    isSearchOpen: false,
    setSearchOpen: (open) => set({ isSearchOpen: open }),

    isCanvasOpen: false,
    setCanvasOpen: (open) => set({ isCanvasOpen: open }),
    canvasContent: '# Developer Security & System Guidelines\n\n- Master Developer Secret Passcode is required for Developer access.\n- Unauthorized Developer attempts log client IP address and post security alert.\n- Owners & Managers monitor job progress & software.',
    setCanvasContent: (content) => set({ canvasContent: content }),

    isSettingsOpen: false,
    setSettingsOpen: (open) => set({ isSettingsOpen: open }),

    theme: 'aubergine',
    setTheme: (theme) => set({ theme }),

    clearAllData: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({
        users: INITIAL_USERS,
        currentUser: null,
        channels: INITIAL_CHANNELS,
        messages: INITIAL_MESSAGES,
        jobs: [],
        projects: INITIAL_PROJECTS,
        workspaces: INITIAL_WORKSPACES,
        securityAlerts: [],
        isAuthenticated: false,
      });
    },
  };
});
