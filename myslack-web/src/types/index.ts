export type UserStatus = 'active' | 'away' | 'huddle' | 'dnd' | 'offline';
export type UserRole = 'developer' | 'owner' | 'manager' | 'employee';

export interface UserPermissions {
  canAssignJobs: boolean;
  canViewActivityLogs: boolean;
  canManageChannels: boolean;
  canManageRoles: boolean;
  canApproveUsers: boolean;
}

export interface SecurityAlert {
  id: string;
  userEmail: string;
  displayName: string;
  attemptedRole: UserRole;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'blocked' | 'flagged';
}

export interface JobItem {
  id: string;
  title: string;
  assignedToUserId: string;
  assignedByUserId: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  createdById: string;
  assignedUserIds: string[]; // List of user IDs assigned to this project
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  isApproved: boolean; // Must be approved by Developer / Admin
  permissions: UserPermissions;
  currentTask?: string;
  onlineSince: string; // ISO string when session started
  joinedAt: string;
  customStatus?: string;
  status: UserStatus;
  assignedJobs?: JobItem[];
  lastKnownIp?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  iconUrl: string;
  unreadCount?: number;
}

export type ChannelType = 'public' | 'private' | 'dm';

export interface Channel {
  id: string;
  workspaceId: string;
  projectId?: string; // Optional project association
  name: string;
  topic?: string;
  type: ChannelType;
  unreadCount?: number;
  membersCount: number;
  assignedUserIds?: string[];
  dmUserId?: string; // If channel is a 1-on-1 DM
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  fileType: 'image' | 'code' | 'pdf' | 'video';
  previewUrl?: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  parentMessageId?: string;
  replyCount?: number;
  lastReplyAt?: string;
  reactions: Reaction[];
  attachments?: Attachment[];
  isPinned?: boolean;
}

export type SlackTheme = 'aubergine' | 'nocturne' | 'light' | 'goth';

export interface HuddleState {
  active: boolean;
  channelId?: string;
  channelName?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  participants: User[];
}
