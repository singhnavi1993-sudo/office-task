import React from 'react';
import { useSlackStore } from '../../store/useSlackStore';
import { X, FileText, Save, Check } from 'lucide-react';

export const CanvasDrawer: React.FC = () => {
  const { isCanvasOpen, setCanvasOpen, canvasContent, setCanvasContent } = useSlackStore();
  const [saved, setSaved] = React.useState(false);

  if (!isCanvasOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <aside className="w-96 h-full border-l border-slate-800 bg-slate-950 flex flex-col z-20 select-none shadow-2xl">
      {/* Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-slate-100">Channel Canvas</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={() => setCanvasOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        <textarea
          value={canvasContent}
          onChange={(e) => setCanvasContent(e.target.value)}
          className="w-full h-full bg-transparent text-slate-200 font-mono text-sm leading-relaxed focus:outline-none resize-none"
          placeholder="Type notes, docs, or team guidelines here..."
        />
      </div>
    </aside>
  );
};
