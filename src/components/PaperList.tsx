import React, { useState } from 'react';
import { Paper } from '../data/mockData';
import { PaperCard } from './PaperCard';
import { Search, Plus } from 'lucide-react';
import './PaperList.css';

interface PaperListProps {
  papers: Paper[];
  selectedPaperId: string | null;
  onSelectPaper: (paper: Paper) => void;
  onAddPaper?: () => void;
}

export const PaperList: React.FC<PaperListProps> = ({ 
  papers, 
  selectedPaperId, 
  onSelectPaper,
  onAddPaper
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="paper-list-wrapper">
      <div className="list-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search papers, keywords..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary add-btn" onClick={onAddPaper} title="Add New Paper">
          <Plus size={18} />
          <span>Add Paper</span>
        </button>
      </div>

      <div className="papers-scroll-area">
        {filteredPapers.length === 0 ? (
          <div className="empty-state">No papers found.</div>
        ) : (
          filteredPapers.map(paper => (
            <PaperCard 
              key={paper.id} 
              paper={paper} 
              isSelected={paper.id === selectedPaperId}
              onClick={onSelectPaper}
            />
          ))
        )}
      </div>
    </div>
  );
};
