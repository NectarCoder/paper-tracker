import React, { useState } from 'react';
import { WorkspaceManager } from './components/WorkspaceManager';
import { Sidebar } from './components/Sidebar';
import { PaperList } from './components/PaperList';
import { GraphView } from './components/GraphView';
import { PaperForm } from './components/PaperForm';
import { SplitPane } from './components/SplitPane';
import { useWorkspace } from './hooks/useWorkspace';
import { Paper, PaperLink } from './types';

const EMPTY_PAPERS: Paper[] = [];
const EMPTY_LINKS: PaperLink[] = [];

function App() {
  const {
    workspace,
    activeCollection,
    activeCollectionId,
    setActiveCollectionId,
    createNewWorkspace,
    openWorkspace,
    saveWorkspace,
    addCollection,
    updateCollectionName,
    savePaper,
    updateWorkspaceName
  } = useWorkspace();

  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const handleSelectPaper = (id: string) => {
    setSelectedPaperId(id);
  };

  const handleAddClick = () => {
    setEditingPaper(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (paper: Paper) => {
    setEditingPaper(paper);
    setIsFormOpen(true);
  };

  const handleSavePaperForm = (newPaper: Paper) => {
    savePaper(newPaper);
  };

  if (!workspace) {
    return (
      <div className="h-screen w-screen bg-slate-900">
        <WorkspaceManager onOpen={openWorkspace} onCreate={createNewWorkspace} />
      </div>
    );
  }

  const papers = activeCollection?.papers || EMPTY_PAPERS;
  const links = activeCollection?.links || EMPTY_LINKS;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-900 text-slate-200">
      <Sidebar 
        workspace={workspace}
        activeCollectionId={activeCollectionId}
        onSelectCollection={setActiveCollectionId}
        onAddCollection={addCollection}
        onUpdateCollectionName={updateCollectionName}
        onUpdateWorkspaceName={updateWorkspaceName}
        onSaveWorkspace={saveWorkspace}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <SplitPane 
          initialLeftWidth={35}
          left={
            <PaperList 
              papers={papers}
              selectedPaperId={selectedPaperId}
              onSelectPaper={handleSelectPaper}
              onAddPaper={handleAddClick}
              onEditPaper={handleEditClick}
            />
          }
          right={
            <GraphView 
              papers={papers}
              links={links}
              selectedPaperId={selectedPaperId}
              onNodeClick={handleSelectPaper}
            />
          }
        />
      </div>

      <PaperForm 
        isOpen={isFormOpen}
        paper={editingPaper}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePaperForm}
      />
    </div>
  );
}

export default App;
