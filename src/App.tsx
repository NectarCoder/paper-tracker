import React, { useState } from 'react';
import { SplitPane } from './components/SplitPane';
import { ThemeToggle } from './components/ThemeToggle';
import { PaperList } from './components/PaperList';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { PaperForm } from './components/PaperForm';
import { mockPapers, mockCitations, Paper } from './data/mockData';
import './App.css';

function App() {
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [citations] = useState(mockCitations);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaperId(paper.id);
  };

  const handleAddClick = () => {
    setEditingPaper(null);
    setIsFormOpen(true);
  };

  const handleSavePaper = (newPaper: Paper) => {
    setPapers(prev => {
      const exists = prev.find(p => p.id === newPaper.id);
      if (exists) {
        return prev.map(p => p.id === newPaper.id ? newPaper : p);
      }
      return [...prev, newPaper];
    });
  };

  const renderLeftPane = () => (
    <div className="left-pane-content">
      <header className="app-header glass-panel">
        <div className="header-title">
          <h1>Paper Tracker</h1>
          <span className="badge">v0.1 Mock</span>
        </div>
        <ThemeToggle />
      </header>
      
      <div className="list-container">
        <PaperList 
          papers={papers} 
          selectedPaperId={selectedPaperId} 
          onSelectPaper={handleSelectPaper} 
          onAddPaper={handleAddClick}
        />
      </div>
    </div>
  );

  const renderRightPane = () => (
    <div className="right-pane-content">
      <KnowledgeGraph 
        papers={papers} 
        citations={citations} 
        selectedPaperId={selectedPaperId} 
        onNodeClick={handleSelectPaper}
      />
    </div>
  );

  return (
    <div className="app-container">
      <SplitPane 
        left={renderLeftPane()} 
        right={renderRightPane()} 
        initialLeftWidth={35}
      />
      
      <PaperForm 
        isOpen={isFormOpen} 
        paper={editingPaper} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSavePaper}
      />
    </div>
  );
}

export default App;
