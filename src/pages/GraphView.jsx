import React, { useEffect, useState, useRef, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphView() {
  const { currentUser } = useAuth();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const q = query(
          collection(db, 'papers'), 
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const papers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const nodes = [];
        const links = [];
        
        // 1. Add all papers as nodes
        papers.forEach(paper => {
          nodes.push({
            id: paper.id,
            name: paper.title,
            val: 2, // Size
            color: 'var(--accent-primary)',
            type: 'paper'
          });
          
          // 2. Add explicit citation links
          if (paper.citations && Array.isArray(paper.citations)) {
            paper.citations.forEach(citedId => {
              // Ensure we only link if the target node exists in our dataset
              if (papers.find(p => p.id === citedId)) {
                links.push({
                  source: paper.id,
                  target: citedId,
                  name: 'Cites',
                  color: 'rgba(255,255,255,0.2)'
                });
              }
            });
          }
        });

        // 3. Find keyword overlaps to create implicit links
        for (let i = 0; i < papers.length; i++) {
          for (let j = i + 1; j < papers.length; j++) {
            const p1 = papers[i];
            const p2 = papers[j];
            
            if (p1.keywords && p2.keywords) {
              const sharedKeywords = p1.keywords.filter(k => p2.keywords.includes(k));
              if (sharedKeywords.length > 0) {
                links.push({
                  source: p1.id,
                  target: p2.id,
                  name: `Shared: ${sharedKeywords.join(', ')}`,
                  color: 'rgba(129, 140, 248, 0.2)', // Different color for keyword links
                  lineDash: [5, 5] // Dashed line
                });
              }
            }
          }
        }

        setGraphData({ nodes, links });
      } catch (err) {
        setError('Failed to load graph: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchGraphData();
    }
  }, [currentUser]);

  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

    ctx.fillStyle = 'rgba(15, 17, 21, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color || '#fff';
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; 
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Interactive Graph</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Solid lines represent direct citations. Dashed lines represent shared keywords.</p>
      </div>

      {error && <div style={{ background: 'var(--color-danger)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass-card" ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)' }}>
            Analyzing connections...
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)' }}>
            No papers to display in graph. Add some papers first!
          </div>
        ) : (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={node => node.color}
            linkColor={link => link.color}
            linkLineDash={link => link.lineDash}
            linkWidth={1.5}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              const bckgDimensions = node.__bckgDimensions;
              bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
            }}
          />
        )}
      </div>
    </div>
  );
}
