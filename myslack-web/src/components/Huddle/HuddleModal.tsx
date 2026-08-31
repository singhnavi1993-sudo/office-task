import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Headphones } from 'lucide-react';

export const HuddleModal: React.FC = () => {
  const {
    huddleState,
    endHuddle,
    toggleHuddleMute,
    toggleHuddleVideo,
    toggleHuddleScreenShare,
  } = useSlackStore();

  if (!huddleState.active) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 shadow-2xl z-50 overflow-hidden text-slate-100 select-none animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-teal-900/40 to-slate-900 border-b border-teal-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-glow">
            <Headphones className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-teal-300">#{huddleState.channelName} Huddle</h4>
            <p className="text-[11px] text-slate-400">
              {huddleState.participants.length} connected
            </p>
          </div>
        </div>

        {/* Animated Audio Equalizer */}
        <div className="flex items-end space-x-1 h-5 px-2">
          <span className="w-1 bg-teal-400 rounded-full h-3 animate-pulse" />
          <span className="w-1 bg-teal-300 rounded-full h-5 animate-pulse delay-75" />
          <span className="w-1 bg-teal-400 rounded-full h-2 animate-pulse delay-150" />
          <span className="w-1 bg-teal-500 rounded-full h-4 animate-pulse delay-100" />
        </div>
      </div>

      {/* Participants Grid */}
      <div className="p-4 grid grid-cols-3 gap-3 bg-slate-950/60">
        {huddleState.participants.map((p, idx) => (
          <div
            key={p.id}
            className="relative flex flex-col items-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md group"
          >
            <div className="relative">
              <img
                src={p.avatarUrl}
                alt={p.displayName}
                className={`w-12 h-12 rounded-2xl object-cover ring-2 ${
                  idx === 0 && !huddleState.isMuted
                    ? 'ring-teal-400 shadow-glow'
                    : 'ring-slate-700'
                }`}
              />
              {idx === 0 && huddleState.isMuted && (
                <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center text-rose-400">
                  <MicOff className="w-5 h-5" />
                </div>
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-200 mt-2 truncate w-full text-center">
              {p.displayName.split(' ')[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Call Control Action Bar */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center space-x-4">
        {/* Mute Toggle */}
        <button
          onClick={toggleHuddleMute}
          className={`p-3 rounded-2xl font-bold transition-all ${
            huddleState.isMuted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={huddleState.isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {huddleState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleHuddleVideo}
          className={`p-3 rounded-2xl font-bold transition-all ${
            huddleState.isVideoOn
              ? 'bg-emerald-500 text-white shadow-glow'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Toggle Camera"
        >
          {huddleState.isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share Toggle */}
        <button
          onClick={toggleHuddleScreenShare}
          className={`p-3 rounded-2xl font-bold transition-all ${
            huddleState.isScreenSharing
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Screen Share"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={endHuddle}
          className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg hover:scale-105"
          title="Leave Huddle"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
