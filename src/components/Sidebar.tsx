import React, { useState, useRef } from 'react';
import { Folder, Plus, Settings, Edit2, Save } from 'lucide-react';
import { WorkspaceData, Collection } from '../types';
import { PromptModal } from './PromptModal';

interface SidebarProps {
  workspace: WorkspaceData;
  activeCollectionId: string | null;
  onSelectCollection: (id: string) => void;
  onAddCollection: (name: string) => void;
  onUpdateCollectionName: (id: string, name: string) => void;
  onUpdateWorkspaceName: (name: string) => void;
  onSaveWorkspace: () => void;
  onSaveAsWorkspace: (fallbackName?: string) => void;
  isDirty: boolean;
  lastSavedTime: Date | null;
  hasFileSystemAccess: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspace,
  activeCollectionId,
  onSelectCollection,
  onAddCollection,
  onUpdateCollectionName,
  onUpdateWorkspaceName,
  onSaveWorkspace,
  onSaveAsWorkspace,
  isDirty,
  lastSavedTime,
  hasFileSystemAccess,
}) => {
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colNameInput, setColNameInput] = useState('');
  const [promptState, setPromptState] = useState<{isOpen: boolean, type: 'collection' | 'workspace' | 'save_as', initialValue: string, title: string}>({
    isOpen: false,
    type: 'collection',
    initialValue: '',
    title: ''
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterSave = () => {
    if (!hasFileSystemAccess) {
      tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(true), 500);
    }
  };
  const handleMouseLeaveSave = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(false);
  };

  const handlePromptConfirm = (value: string) => {
    if (value.trim()) {
      if (promptState.type === 'collection') {
        onAddCollection(value.trim());
      } else if (promptState.type === 'workspace') {
        onUpdateWorkspaceName(value.trim());
      } else if (promptState.type === 'save_as') {
        onSaveAsWorkspace(value.trim());
      }
    }
    setPromptState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveAsClick = () => {
    if (hasFileSystemAccess) {
      onSaveAsWorkspace();
    } else {
      setPromptState({
        isOpen: true,
        type: 'save_as',
        initialValue: workspace.name,
        title: 'Enter filename to save as:'
      });
    }
  };
  
  const openWorkspaceRename = () => {
    setPromptState({
      isOpen: true,
      type: 'workspace',
      initialValue: workspace.name,
      title: 'Rename Workspace'
    });
  };

  const openCollectionCreate = () => {
    setPromptState({
      isOpen: true,
      type: 'collection',
      initialValue: '',
      title: 'Enter new collection name:'
    });
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
          <h2 className="font-semibold text-lg text-white truncate flex-1" title={workspace.name}>
            {workspace.name}{isDirty ? '*' : ''}
          </h2>
          <button onClick={openWorkspaceRename} className="p-1 hover:text-white transition-colors">
            <Edit2 size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 relative">
            <div className="flex-1 relative flex">
              <button 
                onClick={hasFileSystemAccess ? onSaveWorkspace : undefined}
                onMouseEnter={handleMouseEnterSave}
                onMouseLeave={handleMouseLeaveSave}
                aria-disabled={!hasFileSystemAccess}
                className={`w-full flex items-center justify-center gap-2 py-2 px-2 rounded transition-colors text-sm text-white ${
                  hasFileSystemAccess 
                    ? "bg-emerald-600 hover:bg-emerald-500" 
                    : "bg-emerald-600/50 cursor-not-allowed opacity-50"
                }`}
              >
                <Save size={16} />
                Save
              </button>
              {showTooltip && !hasFileSystemAccess && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-slate-900 border border-slate-700 text-xs rounded shadow-xl z-50 w-48 break-words text-slate-300">
                  Please use a compatible Chromium-based browser for auto-saving.
                </div>
              )}
            </div>
            <button 
              onClick={handleSaveAsClick}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white py-2 px-2 rounded transition-colors text-sm"
              title="Save As"
            >
              <Save size={16} />
              Save As
            </button>
          </div>
          {lastSavedTime && (
            <div className="text-xs text-slate-400 text-center">
              Last saved: {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 text-slate-400 text-sm uppercase font-semibold">
          <span>Collections</span>
          <button onClick={openCollectionCreate} className="hover:text-white transition-colors">
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
      
      <PromptModal
        isOpen={promptState.isOpen}
        title={promptState.title}
        initialValue={promptState.initialValue}
        onConfirm={handlePromptConfirm}
        onCancel={() => setPromptState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
