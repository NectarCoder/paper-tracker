import { useState, useCallback } from 'react';
import { WorkspaceData, Collection, Paper } from '../types';

const DEFAULT_WORKSPACE: WorkspaceData = {
  version: '1.0',
  name: 'My Workspace',
  collections: [
    {
      id: crypto.randomUUID(),
      name: 'Default Collection',
      papers: [],
      links: []
    }
  ]
};

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const createNewWorkspace = () => {
    const newWs = { ...DEFAULT_WORKSPACE, collections: [{ ...DEFAULT_WORKSPACE.collections[0], id: crypto.randomUUID() }] };
    setWorkspace(newWs);
    setActiveCollectionId(newWs.collections[0].id);
    setFileHandle(null);
  };

  const openWorkspace = async () => {
    try {
      // @ts-ignore
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Paper Tracker Workspace',
            accept: {
              'application/json': ['.ptrk', '.json'],
            },
          },
        ],
      });
      const file = await handle.getFile();
      const text = await file.text();
      const data = JSON.parse(text) as WorkspaceData;
      setWorkspace(data);
      if (data.collections.length > 0) {
        setActiveCollectionId(data.collections[0].id);
      }
      setFileHandle(handle);
    } catch (error) {
      console.error("Failed to open file", error);
    }
  };

  const saveWorkspace = async (currentWs: WorkspaceData) => {
    if (!currentWs) return;

    try {
      let handle = fileHandle;
      if (!handle) {
        // @ts-ignore
        handle = await window.showSaveFilePicker({
          suggestedName: `${currentWs.name.replace(/\s+/g, '_')}.ptrk`,
          types: [
            {
              description: 'Paper Tracker Workspace',
              accept: {
                'application/json': ['.ptrk'],
              },
            },
          ],
        });
        setFileHandle(handle);
      }
      // @ts-ignore
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(currentWs, null, 2));
      await writable.close();
      setWorkspace(currentWs);
    } catch (error) {
      console.error("Failed to save file", error);
    }
  };

  const updateWorkspace = (updater: (prev: WorkspaceData) => WorkspaceData) => {
    setWorkspace(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const addCollection = (name: string) => {
    if (!workspace) return;
    if (workspace.collections.some(c => c.name === name)) {
      alert("Collection name must be unique");
      return;
    }
    const newId = crypto.randomUUID();
    updateWorkspace(prev => ({
      ...prev,
      collections: [...prev.collections, { id: newId, name, papers: [], links: [] }]
    }));
    setActiveCollectionId(newId);
  };

  const updateCollectionName = (id: string, newName: string) => {
      updateWorkspace(prev => ({
        ...prev,
        collections: prev.collections.map(c => c.id === id ? { ...c, name: newName } : c)
      }));
  }

  const activeCollection = workspace?.collections.find(c => c.id === activeCollectionId) || null;

  const savePaper = (paper: Paper) => {
    if (!activeCollectionId) return;
    updateWorkspace(prev => ({
      ...prev,
      collections: prev.collections.map(c => {
        if (c.id === activeCollectionId) {
          const idx = c.papers.findIndex(p => p.id === paper.id);
          const newPapers = [...c.papers];
          if (idx >= 0) newPapers[idx] = paper;
          else newPapers.push(paper);
          return { ...c, papers: newPapers };
        }
        return c;
      })
    }));
  };

  const deletePaper = (paperId: string) => {
    if (!activeCollectionId) return;
    updateWorkspace(prev => ({
      ...prev,
      collections: prev.collections.map(c => {
        if (c.id === activeCollectionId) {
          return { ...c, papers: c.papers.filter(p => p.id !== paperId) };
        }
        return c;
      })
    }));
  }

  const addLink = (sourceDoi: string, targetDoi: string) => {
     if (!activeCollectionId) return;
     updateWorkspace(prev => ({
        ...prev,
        collections: prev.collections.map(c => {
          if (c.id === activeCollectionId) {
             const newLink = { id: crypto.randomUUID(), source: sourceDoi, target: targetDoi };
             return { ...c, links: [...c.links, newLink] };
          }
          return c;
        })
     }));
  }

  return {
    workspace,
    activeCollection,
    activeCollectionId,
    setActiveCollectionId,
    createNewWorkspace,
    openWorkspace,
    saveWorkspace: () => workspace && saveWorkspace(workspace),
    addCollection,
    updateCollectionName,
    savePaper,
    deletePaper,
    addLink,
    updateWorkspaceName: (name: string) => updateWorkspace(prev => ({ ...prev, name })),
  };
}
