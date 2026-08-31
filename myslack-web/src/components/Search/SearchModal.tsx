import React, { useState, useEffect } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Search, Hash, MessageSquare, X } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, channels, messages, users, setActiveChannel } =
    useSlackStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    u.displayName.toLowerCase().includes(query.toLowerCase())
  );
  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 z-50 select-none animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, messages, people, or files... (Esc to close)"
            className="flex-1 bg-transparent text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Channels Match */}
          {filteredChannels.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Channels
              </p>
              <div className="space-y-1">
                {filteredChannels.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChannel(c.id);
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-all text-left"
                  >
                    <Hash className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm">#{c.name}</span>
                    <span className="text-xs text-slate-400 truncate">{c.topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People Match */}
          {filteredUsers.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                People
              </p>
              <div className="space-y-1">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-all cursor-pointer"
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.displayName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{u.displayName}</p>
                      <p className="text-xs text-slate-400">@{u.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Match */}
          {query.trim() && filteredMessages.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Messages
              </p>
              <div className="space-y-1">
                {filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveChannel(m.channelId);
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-800 text-slate-200 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-slate-300">{m.userName}</span>
                      <span>{m.createdAt}</span>
                    </div>
                    <p className="text-sm text-slate-200 truncate">{m.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
