import React from 'react';
import { Paper } from '../data/mockData';
import { FileText, Calendar, MapPin, Award } from 'lucide-react';
import './PaperCard.css';

interface PaperCardProps {
  paper: Paper;
  isSelected?: boolean;
  onClick?: (paper: Paper) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, isSelected, onClick }) => {
  return (
    <div 
      className={`paper-card glass-panel ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick && onClick(paper)}
    >
      <div className="paper-card-header">
        <h3 className="paper-title">{paper.title}</h3>
      </div>
      
      <div className="paper-meta">
        {paper.venue && (
          <span className="meta-item" title="Venue">
            <MapPin size={14} /> {paper.venue}
          </span>
        )}
        <span className="meta-item" title="Year">
          <Calendar size={14} /> {paper.year}
        </span>
        {paper.ranking && (
          <span className="meta-item" title="Ranking">
            <Award size={14} /> {paper.ranking}
          </span>
        )}
      </div>

      <p className="paper-abstract">
        {paper.abstract.length > 150 ? `${paper.abstract.substring(0, 150)}...` : paper.abstract}
      </p>

      <div className="paper-keywords">
        {paper.keywords.map(kw => (
          <span key={kw} className="keyword-tag">{kw}</span>
        ))}
      </div>
    </div>
  );
};
