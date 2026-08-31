import type { User, Workspace, Channel, Message, UserPermissions, ProjectItem } from '../types';

export const DEFAULT_PERMISSIONS: Record<string, UserPermissions> = {
  developer: {
    canAssignJobs: true,
    canViewActivityLogs: true,
    canManageChannels: true,
    canManageRoles: true,
    canApproveUsers: true,
  },
  owner: {
    canAssignJobs: true,
    canViewActivityLogs: true,
    canManageChannels: true,
    canManageRoles: true,
    canApproveUsers: false,
  },
  manager: {
    canAssignJobs: true,
    canViewActivityLogs: true,
    canManageChannels: false,
    canManageRoles: false,
    canApproveUsers: false,
  },
  employee: {
    canAssignJobs: false,
    canViewActivityLogs: false,
    canManageChannels: false,
    canManageRoles: false,
    canApproveUsers: false,
  },
};

// Clean initial empty user list until Developer and team register!
export const INITIAL_USERS: User[] = [];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Enterprise Workspace',
    slug: 'enterprise-hq',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
    unreadCount: 0,
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Core Software Platform',
    description: 'Main product engineering & feature development workspace',
    createdById: 'usr-dev-1',
    assignedUserIds: [],
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: 'proj-2',
    name: 'Client Project Alpha',
    description: 'Custom client deliverables, design system & integration tasks',
    createdById: 'usr-dev-1',
    assignedUserIds: [],
    createdAt: new Date().toLocaleDateString(),
  },
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'chn-general',
    workspaceId: 'ws-1',
    name: 'general',
    topic: 'Company-wide announcements & team workspace discussions',
    type: 'public',
    membersCount: 0,
  },
  {
    id: 'chn-developer-admin',
    workspaceId: 'ws-1',
    name: 'developer-admin-room',
    topic: '⚡ Supreme Developer Admin Controls & Authority Logs',
    type: 'private',
    membersCount: 0,
  },
  {
    id: 'chn-owner-manager-room',
    workspaceId: 'ws-1',
    name: 'owner-manager-room',
    topic: '🔒 Owner & Manager Job Tracking, Employee Activity & Time Logs',
    type: 'private',
    membersCount: 0,
  },
  {
    id: 'chn-job-updates',
    workspaceId: 'ws-1',
    name: 'job-updates',
    topic: 'Post and track employee job progress & task status',
    type: 'public',
    membersCount: 0,
  },
];

export const INITIAL_MESSAGES: Message[] = [];
