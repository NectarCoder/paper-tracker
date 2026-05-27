import React, { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { Paper, Citation } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import './KnowledgeGraph.css';

interface KnowledgeGraphProps {
  papers: Paper[];
  citations: Citation[];
  selectedPaperId: string | null;
  onNodeClick: (paper: Paper) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  papers, 
  citations, 
  selectedPaperId,
  onNodeClick
}) => {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Prepare graph data
  const graphData = {
    nodes: papers.map(p => ({ ...p, val: 1 })), // val defines relative size
    links: citations.map(c => ({ source: c.source, target: c.target }))
  };

  useEffect(() => {
    // Resize observer to make graph responsive
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Pan and zoom to selected node
  useEffect(() => {
    if (selectedPaperId && fgRef.current) {
      const node = graphData.nodes.find(n => n.id === selectedPaperId);
      if (node) {
        // We use any here because ForceGraph node typing can be tricky before initialization
        const anyNode = node as any; 
        if (anyNode.x !== undefined && anyNode.y !== undefined) {
          fgRef.current.centerAt(anyNode.x, anyNode.y, 1000);
          fgRef.current.zoom(3, 1000);
        }
      }
    }
  }, [selectedPaperId, graphData.nodes]);

  const handleNodeClick = useCallback((node: any) => {
    // Re-find the exact Paper object just to be safe
    const paper = papers.find(p => p.id === node.id);
    if (paper) onNodeClick(paper);
  }, [papers, onNodeClick]);

  // Colors based on theme
  const bgColor = resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc';
  const nodeColor = resolvedTheme === 'dark' ? '#60a5fa' : '#3b82f6';
  const selectedNodeColor = resolvedTheme === 'dark' ? '#a78bfa' : '#8b5cf6';
  const linkColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const textColor = resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div className="graph-wrapper" ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeId="id"
          nodeColor={(node: any) => node.id === selectedPaperId ? selectedNodeColor : nodeColor}
          nodeRelSize={6}
          linkColor={() => linkColor}
          linkWidth={2}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          backgroundColor={bgColor}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.title;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            ctx.fillStyle = bgColor;
            // Only draw background if selected or hovered (simulated by scale?)
            // We'll just draw it always for better readability, but slightly transparent
            ctx.globalAlpha = 0.8;
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - 10 - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
            
            ctx.globalAlpha = 1;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.id === selectedPaperId ? selectedNodeColor : textColor;
            ctx.fillText(label, node.x, node.y - 10);

            // Draw Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.id === selectedPaperId ? selectedNodeColor : nodeColor;
            ctx.fill();
            
            // Draw a stroke if selected
            if (node.id === selectedPaperId) {
               ctx.strokeStyle = '#fff';
               ctx.lineWidth = 1;
               ctx.stroke();
            }
          }}
        />
      )}
    </div>
  );
};
