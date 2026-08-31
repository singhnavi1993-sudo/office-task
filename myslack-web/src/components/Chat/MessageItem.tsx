import React, { useState } from 'react';
import type { Message } from '../../types';
import { useSlackStore } from '../../store/useSlackStore';
import { MessageSquare, Smile, Bookmark, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { toggleReaction, setActiveThreadMessage, currentUser } = useSlackStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const quickEmojis = ['👍', '❤️', '🚀', '🔥', '🎉', '💯', '🙌', '✨'];

  // Enhanced Formatting Renderer supporting Nested Bold + Italic (***text*** or **_text_**)
  const renderFormattedContent = (text: string) => {
    // Check if message is ONLY emojis (jumbo emoji mode)
    const isJumboEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u.test(text.trim()) && text.trim().length <= 10;

    if (isJumboEmoji) {
      return <span className="text-4xl leading-snug tracking-wider inline-block my-1">{text}</span>;
    }

    // Code Blocks ```code```
    if (text.includes('```')) {
      const parts = text.split(/```/);
      return (
        <div>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              const cleanedCode = part.replace(/^(csharp|typescript|javascript|html|css|json)\n?/, '');
              return (
                <div
                  key={index}
                  className="my-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner leading-normal"
                >
                  {cleanedCode.trim()}
                </div>
              );
            }
            return <span key={index}>{renderInlineFormatting(part)}</span>;
          })}
        </div>
      );
    }

    return renderInlineFormatting(text);
  };

  // Process Italic (* or _) and Code (` `)
  const renderItalicAndCode = (text: string) => {
    // Process Italic (* or _)
    const italicParts = text.split(/(\*|_)/);
    let isItalic = false;
    const elements: React.ReactNode[] = [];

    italicParts.forEach((part, i) => {
      if (part === '*' || part === '_') {
        isItalic = !isItalic;
        return;
      }

      if (!part) return;

      // Inline code inside italic/text
      const codeParts = part.split(/`/);
      const subElements = codeParts.map((codeChunk, cIdx) =>
        cIdx % 2 === 1 ? (
          <code
            key={cIdx}
            className="px-1.5 py-0.5 rounded-md bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800"
          >
            {codeChunk}
          </code>
        ) : (
          codeChunk
        )
      );

      if (isItalic) {
        elements.push(
          <em key={i} className="italic font-medium text-indigo-200">
            {subElements}
          </em>
        );
      } else {
        elements.push(<span key={i}>{subElements}</span>);
      }
    });

    return elements;
  };

  // Helper for **bold** and nested formatting
  const renderInlineFormatting = (inlineText: string) => {
    // Process Bold (**bold**) first
    const boldParts = inlineText.split(/\*\*/);

    return (
      <span>
        {boldParts.map((boldChunk, bIdx) => {
          if (bIdx % 2 === 1) {
            // Bold chunk -> render <strong> containing nested italic & code!
            return (
              <strong key={bIdx} className="font-extrabold text-white">
                {renderItalicAndCode(boldChunk)}
              </strong>
            );
          }
          // Non-bold chunk -> render nested italic & code
          return <span key={bIdx}>{renderItalicAndCode(boldChunk)}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="group relative flex space-x-4 px-6 py-3 hover:bg-slate-800/40 transition-all">
      {/* User Avatar */}
      <img
        src={message.userAvatar}
        alt={message.userName}
        className="w-11 h-11 rounded-xl object-cover flex-shrink-0 mt-0.5 ring-1 ring-white/10"
      />

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Header line */}
        <div className="flex items-baseline space-x-2.5">
          <span className="font-bold text-base text-slate-100">{message.userName}</span>
          <span className="text-xs text-slate-400">{message.createdAt}</span>
        </div>

        {/* Message Content */}
        <div className="text-base text-slate-100 mt-1.5 leading-relaxed whitespace-pre-wrap break-words font-normal">
          {renderFormattedContent(message.content)}
        </div>

        {/* File Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="max-w-lg p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center space-x-3.5 shadow-sm"
              >
                {att.fileType === 'image' && (att.previewUrl || att.fileUrl) ? (
                  <img
                    src={att.previewUrl || att.fileUrl}
                    alt={att.fileName}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-100 truncate">{att.fileName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(att.fileSizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reactions Row */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.reactions.map((rx) => {
              const hasReacted = rx.users.includes(currentUser?.id || '');
              return (
                <button
                  key={rx.emoji}
                  type="button"
                  onClick={() => toggleReaction(message.id, rx.emoji)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-sm font-semibold border transition-all ${
                    hasReacted
                      ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-200 shadow-sm'
                      : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{rx.emoji}</span>
                  <span>{rx.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Thread Reply Summary Link */}
        {message.replyCount ? (
          <button
            type="button"
            onClick={() => setActiveThreadMessage(message.id)}
            className="flex items-center space-x-2 mt-2.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
            </span>
            {message.lastReplyAt && (
              <span className="text-xs text-slate-400 font-normal">
                Last reply {message.lastReplyAt}
              </span>
            )}
          </button>
        ) : null}
      </div>

      {/* Hover Quick Action Bar */}
      <div className="absolute right-6 -top-3.5 hidden group-hover:flex items-center space-x-1 p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
            title="Add Reaction"
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute right-0 top-10 p-2.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex space-x-1.5 z-20">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    toggleReaction(message.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-slate-800 rounded-xl text-xl hover:scale-135 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setActiveThreadMessage(message.id)}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
          title="Reply in Thread"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
          title="Share message"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
          title="Save item"
        >
          <Bookmark className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
          title="More actions"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
