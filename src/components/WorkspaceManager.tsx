import React from 'react';
import { File, FolderOpen, Plus } from 'lucide-react';

interface WorkspaceManagerProps {
  onOpen: () => void;
  onCreate: () => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onOpen, onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-slate-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Paper Tracker</h1>
        <p className="text-slate-400">Offline-first research organization</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Create New Workspace
        </button>

        <button 
          onClick={onOpen}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600"
        >
          <FolderOpen size={20} />
          Open Existing
        </button>
      </div>
    </div>
  );
};
