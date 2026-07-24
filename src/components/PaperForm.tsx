import React, { useState, useEffect } from 'react';
import { Paper, PublicationType, ConferenceRanking } from '../types';
import { X, Tag as TagIcon } from 'lucide-react';

interface PaperFormProps {
  paper?: Paper | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (paper: Paper) => void;
}

const DEFAULT_PAPER_DATA: Partial<Paper> = {
  title: '',
  doi: '',
  link: '',
  year: new Date().getFullYear(),
  type: 'Conference',
  ranking: 'Unranked',
  reputation: '',
  abstract: '',
  authors: '',
  tags: [],
  notes: ''
};

export const PaperForm: React.FC<PaperFormProps> = ({ paper, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Paper>>(DEFAULT_PAPER_DATA);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setFormData(paper || DEFAULT_PAPER_DATA);
    setTagInput('');
  }, [paper, isOpen]);

  if (!isOpen) return null;

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const newTags = val.split(',').map(t => t.trim()).filter(t => t && !formData.tags?.includes(t));
      if (newTags.length > 0) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), ...newTags] }));
      }
      setTagInput('');
    } else {
      setTagInput(val);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !formData.tags?.includes(val)) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), val] }));
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags && formData.tags.length > 0) {
      setFormData(prev => ({ ...prev, tags: prev.tags!.slice(0, -1) }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaper: Paper = {
      id: paper?.id || crypto.randomUUID(),
      title: formData.title || 'Untitled',
      doi: formData.doi || '',
      link: formData.link || '',
      year: formData.year || new Date().getFullYear(),
      type: formData.type as PublicationType,
      ranking: formData.type === 'Conference' ? formData.ranking : undefined,
      reputation: formData.type === 'Journal' ? formData.reputation : undefined,
      abstract: formData.abstract || '',
      authors: formData.authors || '',
      tags: formData.tags || [],
      notes: formData.notes || ''
    };
    onSave(newPaper);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 text-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-slate-700 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-bold">{paper ? 'Edit Paper' : 'Add New Paper'}</h2>
          <button className="p-1 hover:text-white transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Title *</label>
            <input type="text" required className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">DOI *</label>
              <input type="text" required className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.doi} onChange={e => setFormData({...formData, doi: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Link *</label>
              <input type="url" required className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Year *</label>
              <input type="number" required className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Type *</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PublicationType})}>
                <option value="Conference">Conference</option>
                <option value="Journal">Journal</option>
              </select>
            </div>
            {formData.type === 'Conference' ? (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400">Ranking</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.ranking} onChange={e => setFormData({...formData, ranking: e.target.value as ConferenceRanking})}>
                  <option value="A*">A*</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="National">National</option>
                  <option value="Regional">Regional</option>
                  <option value="Unranked">Unranked</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400">Reputation</label>
                <input type="text" placeholder="e.g. High Impact" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.reputation} onChange={e => setFormData({...formData, reputation: e.target.value})} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Authors</label>
            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.authors} onChange={e => setFormData({...formData, authors: e.target.value})} placeholder="e.g. John Doe, Jane Smith" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Abstract *</label>
            <textarea required rows={3} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Tags / Keywords</label>
            <div className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 flex flex-wrap gap-2 items-center min-h-[42px] focus-within:border-blue-500">
              {formData.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-sm">
                  <TagIcon size={12} />
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                </span>
              ))}
              <input type="text" className="bg-transparent border-none outline-none flex-1 min-w-[120px] text-white text-sm" placeholder="Type and press comma..." value={tagInput} onChange={handleTagInput} onKeyDown={handleTagKeyDown} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Personal Notes</label>
            <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Markdown supported..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
            <button type="button" className="px-4 py-2 rounded text-slate-300 hover:bg-slate-700 transition-colors" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors">Save Paper</button>
          </div>
        </form>
      </div>
    </div>
  );
};
