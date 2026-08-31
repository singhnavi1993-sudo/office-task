import React, { useState, useRef } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import {
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  List,
  Smile,
  Paperclip,
  Send,
  Video,
  Mic,
  X,
} from 'lucide-react';

export const MessageComposer: React.FC = () => {
  const { sendMessage, channels, activeChannelId } = useSlackStore();
  const [content, setContent] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    sendMessage(content, undefined, attachments);
    setContent('');
    setAttachments([]);
    setShowEmojis(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Wrap selected text or insert formatting at cursor
  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}text${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 50);
  };

  // Insert emoji at cursor
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + emoji + content.substring(end);

    setContent(newContent);
    setShowEmojis(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 50);
  };

  // Real File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        const newAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          fileName: file.name,
          fileUrl,
          fileSizeBytes: file.size,
          fileType: isImage ? 'image' : 'code',
          previewUrl: isImage ? fileUrl : undefined,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const emojiCategories = [
    { title: 'Frequent', items: ['👍', '❤️', '🚀', '🔥', '🎉', '💯', '🙌', '💻', '🎨', '✨'] },
    { title: 'Smileys', items: ['😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊'] },
    { title: 'Gestures', items: ['👋', '👏', '🤝', '💪', '✌️', '🤞', '🤙', '🖐️', '👊', '👌'] },
    { title: 'Objects & Tech', items: ['⚡', '🤖', '📦', '📊', '📈', '📌', '🔑', '💡', '🏆', '🎯'] },
  ];

  return (
    <div className="px-6 pb-6 pt-2">
      {/* Hidden File Input for Real Attachments */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl focus-within:border-indigo-500 transition-all overflow-hidden">
        {/* Formatting Bar */}
        <div className="px-3.5 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => applyFormatting('**', '**')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Bold (**text**)"
          >
            <Bold className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting('*', '*')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Italic (*text*)"
          >
            <Italic className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting('```\n', '\n```')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Code Block (```code```)"
          >
            <Code className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting('[', '](https://)')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Insert Link"
          >
            <LinkIcon className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting('\n- ')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Bullet List"
          >
            <List className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Text Area Input - Larger text-base (16px) font */}
        <div className="p-3.5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${activeChannel.name}`}
            rows={3}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base leading-relaxed focus:outline-none resize-none"
          />

          {/* Attachment Preview Cards */}
          {attachments.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div
                  key={att.id}
                  className="px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-sm font-semibold flex items-center space-x-2.5 shadow-sm"
                >
                  {att.fileType === 'image' && att.previewUrl ? (
                    <img
                      src={att.previewUrl}
                      alt={att.fileName}
                      className="w-7 h-7 rounded object-cover"
                    />
                  ) : (
                    <span className="text-base">📎</span>
                  )}
                  <span className="truncate max-w-xs">{att.fileName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-1 rounded hover:bg-indigo-900 text-indigo-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar & Send Actions */}
        <div className="px-3.5 py-2.5 bg-slate-950/40 border-t border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Real File Upload Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-all"
              title="Attach File / Images"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Emoji Picker Popup Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className={`p-2 rounded-lg hover:bg-slate-800 transition-all ${
                  showEmojis ? 'text-amber-400 bg-slate-800' : 'text-slate-400 hover:text-amber-400'
                }`}
                title="Insert Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Jumbo Emoji Keyboard Popup */}
              {showEmojis && (
                <div className="absolute left-0 bottom-12 w-80 p-4 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl z-40 space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200">Emoji Keyboard</span>
                    <button
                      type="button"
                      onClick={() => setShowEmojis(false)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                    {emojiCategories.map((cat) => (
                      <div key={cat.title}>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          {cat.title}
                        </p>
                        <div className="grid grid-cols-5 gap-1.5">
                          {cat.items.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="p-2 hover:bg-slate-800 rounded-2xl text-2xl hover:scale-135 transition-all text-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => applyFormatting('\n> Quote: ')}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"
              title="Quote"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => insertEmoji('🎙️ ')}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all"
              title="Insert Voice Note Emoji"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!content.trim() && attachments.length === 0}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm flex items-center space-x-2 transition-all shadow-md"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
