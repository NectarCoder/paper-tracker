import React, { useState } from 'react';
import { Paper } from '../types';
import { PaperCard } from './PaperCard';
import { Search, Plus } from 'lucide-react';

interface PaperListProps {
  papers: Paper[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
  onAddPaper?: () => void;
  onEditPaper?: (paper: Paper) => void;
}

export const PaperList: React.FC<PaperListProps> = ({ 
  papers, 
  selectedPaperId, 
  onSelectPaper,
  onAddPaper,
  onEditPaper
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
      <div className="p-4 border-b border-slate-700 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by keyword, author, abstract..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button 
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap" 
            onClick={onAddPaper} 
            title="Add New Paper"
          >
            <Plus size={16} />
            Add Paper
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPapers.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No papers found.</div>
        ) : (
          filteredPapers.map(paper => (
            <PaperCard 
              key={paper.id} 
              paper={paper} 
              isSelected={paper.id === selectedPaperId}
              onClick={onSelectPaper}
              onEdit={onEditPaper}
            />
          ))
        )}
      </div>
    </div>
  );
};
