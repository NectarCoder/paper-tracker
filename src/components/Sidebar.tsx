import React, { useState } from 'react';
import { Folder, Plus, Settings, Edit2, Save } from 'lucide-react';
import { WorkspaceData, Collection } from '../types';

interface SidebarProps {
  workspace: WorkspaceData;
  activeCollectionId: string | null;
  onSelectCollection: (id: string) => void;
  onAddCollection: (name: string) => void;
  onUpdateCollectionName: (id: string, name: string) => void;
  onUpdateWorkspaceName: (name: string) => void;
  onSaveWorkspace: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspace,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  onUpdateCollectionName,
  onUpdateWorkspaceName,
  onSaveWorkspace,
}) => {
  const [isEditingWsName, setIsEditingWsName] = useState(false);
  const [wsNameInput, setWsNameInput] = useState(workspace.name);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colNameInput, setColNameInput] = useState('');

  const handleSaveWsName = () => {
    if (wsNameInput.trim()) {
      onUpdateWorkspaceName(wsNameInput.trim());
    }
    setIsEditingWsName(false);
  };

  const handleAddCollection = () => {
    const name = prompt("Enter new collection name:");
    if (name && name.trim()) {
      onAddCollection(name.trim());
    }
  };

  const handleSaveColName = (id: string) => {
    if (colNameInput.trim()) {
      onUpdateCollectionName(id, colNameInput.trim());
    }
    setEditingColId(null);
  };

  return (
    <div className="w-64 bg-slate-800 text-slate-300 h-full flex flex-col border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          {isEditingWsName ? (
            <input 
              autoFocus
              className="bg-slate-700 text-white px-2 py-1 rounded w-full mr-2 outline-none"
              value={wsNameInput}
              onChange={(e) => setWsNameInput(e.target.value)}
              onBlur={handleSaveWsName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveWsName()}
            />
          ) : (
            <h2 className="font-semibold text-lg text-white truncate flex-1" title={workspace.name}>
              {workspace.name}
            </h2>
          )}
          {!isEditingWsName && (
            <button onClick={() => { setWsNameInput(workspace.name); setIsEditingWsName(true); }} className="p-1 hover:text-white transition-colors">
              <Edit2 size={16} />
            </button>
          )}
        </div>
        
        <button 
          onClick={onSaveWorkspace}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded transition-colors"
        >
          <Save size={18} />
          Save Workspace
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 text-slate-400 text-sm uppercase font-semibold">
          <span>Collections</span>
          <button onClick={handleAddCollection} className="hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {workspace.collections.map(col => (
            <div key={col.id} className="flex items-center group">
              {editingColId === col.id ? (
                <input 
                  autoFocus
                  className="bg-slate-700 text-white px-2 py-1 rounded w-full outline-none text-sm"
                  value={colNameInput}
                  onChange={(e) => setColNameInput(e.target.value)}
                  onBlur={() => handleSaveColName(col.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveColName(col.id)}
                />
              ) : (
                <button
                  onClick={() => onSelectCollection(col.id)}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded text-left transition-colors text-sm
                    ${activeCollectionId === col.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-slate-700/50 hover:text-slate-200'}`}
                >
                  <Folder size={16} className={activeCollectionId === col.id ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="truncate">{col.name}</span>
                </button>
              )}
              
              {!editingColId && (
                <button 
                  onClick={() => { setColNameInput(col.name); setEditingColId(col.id); }} 
                  className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
