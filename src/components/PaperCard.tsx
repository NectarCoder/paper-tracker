import React from 'react';
import { Paper } from '../types';
import { FileText, Calendar, MapPin, Award, ExternalLink } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  isSelected?: boolean;
  onClick?: (paperId: string) => void;
  onEdit?: (paper: Paper) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, isSelected, onClick, onEdit }) => {
  return (
    <div 
      className={`glass-panel flex flex-col gap-2 p-4 mb-4 cursor-pointer transition-all border hover:-translate-y-0.5 hover:shadow-xl dark:hover:shadow-black/40 ${isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
      onClick={() => onClick && onClick(paper.id)}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-slate-200 line-clamp-2" title={paper.title}>{paper.title}</h3>
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(paper); }}
            className="text-slate-400 hover:text-white shrink-0 text-sm bg-slate-800 px-2 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1" title="Year">
          <Calendar size={14} /> {paper.year}
        </span>
        <span className="flex items-center gap-1" title="Type">
          <FileText size={14} /> {paper.type}
        </span>
        {paper.ranking && paper.type === 'Conference' && (
          <span className="flex items-center gap-1 text-yellow-500/80" title="Ranking">
            <Award size={14} /> {paper.ranking}
          </span>
        )}
        {paper.reputation && paper.type === 'Journal' && (
          <span className="flex items-center gap-1 text-emerald-500/80" title="Reputation">
            <Award size={14} /> {paper.reputation}
          </span>
        )}
        {paper.doi && (
          <span className="flex items-center gap-1" title="DOI">
            <MapPin size={14} /> {paper.doi}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-300 line-clamp-3">
        {paper.abstract}
      </p>

      {paper.tags && paper.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {paper.tags.map(kw => (
            <span key={kw} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">{kw}</span>
          ))}
        </div>
      )}
    </div>
  );
};
