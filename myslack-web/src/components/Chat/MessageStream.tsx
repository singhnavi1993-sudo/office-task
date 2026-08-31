import React, { useRef, useEffect } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { MessageItem } from './MessageItem';
import { Hash } from 'lucide-react';

export const MessageStream: React.FC = () => {
  const { messages, activeChannelId, channels } = useSlackStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter(
    (m) => m.channelId === activeChannelId && !m.parentMessageId
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-2">
      {/* Channel Header Banner */}
      <div className="px-6 py-6 border-b border-slate-800/60 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3">
          <Hash className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Welcome to #{activeChannel.name}!</h2>
        <p className="text-sm text-slate-400 mt-1">
          This is the start of the <span className="font-semibold text-slate-300">#{activeChannel.name}</span> channel. {activeChannel.topic}
        </p>
      </div>

      {/* Message List */}
      {channelMessages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
