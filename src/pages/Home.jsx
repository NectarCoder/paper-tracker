import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPapers() {
      try {
        const q = query(
          collection(db, 'papers'), 
          where('userId', '==', currentUser.uid)
          // orderBy('createdAt', 'desc') // Requires a composite index in Firestore
        );
        const querySnapshot = await getDocs(q);
        const fetchedPapers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Manual sort if index is missing
        fetchedPapers.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setPapers(fetchedPapers);
      } catch (err) {
        setError('Failed to fetch papers: ' + err.message + '. (Check your Firebase config)');
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchPapers();
    }
  }, [currentUser]);

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>All Papers</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search papers..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div style={{ background: 'var(--color-danger)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Loading papers...</div>
      ) : filteredPapers.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <FileText size={48} color="var(--border-focus)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No papers found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {searchTerm ? "No papers matched your search." : "You haven't tracked any papers yet."}
          </p>
          {!searchTerm && <Link to="/add" className="btn-primary">Add Your First Paper</Link>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredPapers.map(paper => (
            <div key={paper.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'white' }}>{paper.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {paper.venue && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--accent-secondary)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {paper.venue}
                    </span>
                  )}
                  {paper.ranking && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {paper.ranking}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {paper.abstract}
                </p>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {paper.keywords?.slice(0, 2).join(', ')} {paper.keywords?.length > 2 && `+${paper.keywords.length - 2}`}
                </div>
                {paper.pdfUrl && (
                  <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                    PDF <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
