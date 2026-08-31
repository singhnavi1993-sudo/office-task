import React, { useState } from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Share2, Copy, Check, X, Shield } from 'lucide-react';

export const InviteModal: React.FC = () => {
  const { isInviteModalOpen, setInviteModalOpen } = useSlackStore();
  const [copied, setCopied] = useState(false);

  if (!isInviteModalOpen) return null;

  const inviteUrl = `${window.location.origin}${window.location.pathname}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 relative space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Invite Members to Workspace</h3>
              <p className="text-xs text-slate-400">Share this link to invite employees & managers</p>
            </div>
          </div>
          <button
            onClick={() => setInviteModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Workspace Invite Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-200 flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>How joining works:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Anyone with this link can set up their profile and join the workspace instantly.</li>
            <li>New members select their role (**Owner**, **Manager**, or **Employee**).</li>
            <li>Owners & Managers can track live online time & active software/tasks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
