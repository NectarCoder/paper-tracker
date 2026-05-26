import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddPaper() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    venue: '',
    ranking: '',
    keywords: '',
    citations: '' // Comma separated IDs for now
  });
  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let pdfUrl = '';

      if (pdfFile) {
        const fileRef = ref(storage, `papers/${currentUser.uid}/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(fileRef, pdfFile);
        pdfUrl = await getDownloadURL(fileRef);
      }

      const paperData = {
        title: formData.title,
        abstract: formData.abstract,
        venue: formData.venue,
        ranking: formData.ranking,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        citations: formData.citations.split(',').map(c => c.trim()).filter(c => c),
        pdfUrl,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'papers'), paperData);
      setSuccess('Paper added successfully!');
      setTimeout(() => navigate('/'), 1500);
      
    } catch (err) {
      setError('Failed to add paper: ' + err.message + '. (Make sure your Firebase config is set in src/firebase.js)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Paper</h2>
      
      {error && <div style={{ background: 'var(--color-danger)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
      {success && <div style={{ background: 'var(--color-success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{success}</div>}

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label className="input-label" htmlFor="title">Paper Title</label>
            <input name="title" id="title" required value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Attention Is All You Need" />
          </div>

          <div>
            <label className="input-label" htmlFor="abstract">Abstract</label>
            <textarea name="abstract" id="abstract" rows="4" value={formData.abstract} onChange={handleChange} className="input-field" placeholder="Brief summary of the paper..."></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="input-label" htmlFor="venue">Conference / Journal</label>
              <input name="venue" id="venue" value={formData.venue} onChange={handleChange} className="input-field" placeholder="e.g. NeurIPS 2017" />
            </div>
            <div>
              <label className="input-label" htmlFor="ranking">Ranking (Optional)</label>
              <input name="ranking" id="ranking" value={formData.ranking} onChange={handleChange} className="input-field" placeholder="e.g. A*" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="input-label" htmlFor="keywords">Keywords (comma separated)</label>
              <input name="keywords" id="keywords" value={formData.keywords} onChange={handleChange} className="input-field" placeholder="Transformer, NLP, Attention" />
            </div>
            <div>
              <label className="input-label" htmlFor="citations">Cited Paper IDs (comma separated)</label>
              <input name="citations" id="citations" value={formData.citations} onChange={handleChange} className="input-field" placeholder="Paper ID 1, Paper ID 2" />
            </div>
          </div>

          <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center', transition: 'border-color var(--transition-fast)' }}>
            <input type="file" accept="application/pdf" id="pdf-upload" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={32} color="var(--accent-secondary)" />
              <span style={{ fontWeight: '500' }}>{pdfFile ? pdfFile.name : 'Click to upload PDF'}</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
