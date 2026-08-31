import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { X, Send } from 'lucide-react';
import { MessageItem } from '../Chat/MessageItem';

export const ThreadDrawer: React.FC = () => {
  const { messages, activeThreadMessageId, setActiveThreadMessage, sendMessage } = useSlackStore();
  const [replyText, setReplyText] = useState('');

  if (!activeThreadMessageId) return null;

  const parentMessage = messages.find((m) => m.id === activeThreadMessageId);
  if (!parentMessage) return null;

  const replies = messages.filter((m) => m.parentMessageId === activeThreadMessageId);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    sendMessage(replyText, activeThreadMessageId);
    setReplyText('');
  };

  return (
    <aside className="w-96 h-full border-l border-slate-800 bg-slate-900 flex flex-col z-20 select-none shadow-2xl">
      {/* Thread Drawer Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-100">Thread</h3>
          <p className="text-xs text-slate-400">#general</p>
        </div>
        <button
          onClick={() => setActiveThreadMessage(null)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Parent Message Card */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <MessageItem message={parentMessage} />
      </div>

      {/* Replies Divider */}
      <div className="px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/20 flex items-center space-x-2">
        <span>{replies.length} Replies</span>
        <div className="flex-1 h-[1px] bg-slate-800" />
      </div>

      {/* Replies Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2">
        {replies.map((reply) => (
          <MessageItem key={reply.id} message={reply} />
        ))}
      </div>

      {/* Thread Reply Composer Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-2 flex items-center space-x-2 focus-within:border-indigo-500 transition-all">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Reply in thread..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim()}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
