import React from 'react';
import { useSlackStore } from './store/useSlackStore';
import { WorkspaceRail } from './components/Sidebar/WorkspaceRail';
import { ChannelSidebar } from './components/Sidebar/ChannelSidebar';
import { ChatHeader } from './components/Header/ChatHeader';
import { MessageStream } from './components/Chat/MessageStream';
import { MessageComposer } from './components/Chat/MessageComposer';
import { ThreadDrawer } from './components/Thread/ThreadDrawer';
import { CanvasDrawer } from './components/Canvas/CanvasDrawer';
import { HuddleModal } from './components/Huddle/HuddleModal';
import { SearchModal } from './components/Search/SearchModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { OwnerDashboardModal } from './components/Admin/OwnerDashboardModal';
import { InviteModal } from './components/Auth/InviteModal';
import { DeveloperAdminPanel } from './components/Admin/DeveloperAdminPanel';

export const App: React.FC = () => {
  const { theme, isAuthenticated } = useSlackStore();

  const getAppBg = () => {
    switch (theme) {
      case 'nocturne':
        return 'bg-slate-950 text-slate-100';
      case 'light':
        return 'bg-slate-50 text-slate-900';
      case 'goth':
        return 'bg-neutral-950 text-neutral-100';
      default: // aubergine dark
        return 'bg-[#1A1D21] text-slate-100';
    }
  };

  // If client is not logged in, render the Auth Screen first!
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans ${getAppBg()}`}>
      {/* 1. Workspace Icon Rail */}
      <WorkspaceRail />

      {/* 2. Channel & DM Navigation Sidebar */}
      <ChannelSidebar />

      {/* 3. Main Workspace Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-900/40 relative">
        <ChatHeader />
        <MessageStream />
        <MessageComposer />
      </main>

      {/* 4. Slide-over Thread Drawer */}
      <ThreadDrawer />

      {/* 5. Channel Canvas Drawer */}
      <CanvasDrawer />

      {/* 6. Audio Huddle Modal Overlay */}
      <HuddleModal />

      {/* 7. Global Cmd+K Search Modal */}
      <SearchModal />

      {/* 8. Settings & Profile Modal */}
      <SettingsModal />

      {/* 9. Owner & Manager Control Center Dashboard */}
      <OwnerDashboardModal />

      {/* 10. Developer Super Admin Panel */}
      <DeveloperAdminPanel />

      {/* 11. Workspace Invite Link Modal */}
      <InviteModal />
    </div>
  );
};

export default App;
