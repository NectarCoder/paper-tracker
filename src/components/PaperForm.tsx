import React, { useState, useEffect } from 'react';
import { Paper } from '../data/mockData';
import { X } from 'lucide-react';
import './PaperForm.css';

interface PaperFormProps {
  paper?: Paper | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (paper: Paper) => void;
}

export const PaperForm: React.FC<PaperFormProps> = ({ paper, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Paper>>({
    title: '',
    abstract: '',
    venue: '',
    year: new Date().getFullYear(),
    ranking: '',
    keywords: [],
  });
  const [keywordsStr, setKeywordsStr] = useState('');

  useEffect(() => {
    if (paper) {
      setFormData(paper);
      setKeywordsStr(paper.keywords.join(', '));
    } else {
      setFormData({
        title: '',
        abstract: '',
        venue: '',
        year: new Date().getFullYear(),
        ranking: '',
        keywords: [],
      });
      setKeywordsStr('');
    }
  }, [paper, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaper: Paper = {
      id: paper?.id || `p${Date.now()}`,
      title: formData.title || 'Untitled',
      abstract: formData.abstract || '',
      venue: formData.venue || '',
      year: formData.year || new Date().getFullYear(),
      ranking: formData.ranking,
      keywords: keywordsStr.split(',').map(k => k.trim()).filter(k => k),
    };
    onSave(newPaper);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{paper ? 'Edit Paper' : 'Add New Paper'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="paper-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Venue / Conference</label>
              <input 
                type="text" 
                value={formData.venue} 
                onChange={e => setFormData({...formData, venue: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input 
                type="number" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} 
              />
            </div>
            <div className="form-group">
              <label>Ranking</label>
              <input 
                type="text" 
                placeholder="e.g. Core A*"
                value={formData.ranking || ''} 
                onChange={e => setFormData({...formData, ranking: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Abstract</label>
            <textarea 
              rows={4}
              value={formData.abstract} 
              onChange={e => setFormData({...formData, abstract: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Keywords (comma separated)</label>
            <input 
              type="text" 
              value={keywordsStr} 
              onChange={e => setKeywordsStr(e.target.value)} 
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Paper</button>
          </div>
        </form>
      </div>
    </div>
  );
};
