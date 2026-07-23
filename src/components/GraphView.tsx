import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { Paper, PaperLink } from '../types';
import './KnowledgeGraph.css'; // Keep reusing the CSS

interface GraphViewProps {
  papers: Paper[];
  links: PaperLink[];
  selectedPaperId: string | null;
  onNodeClick: (paperId: string) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({ 
  papers, 
  links, 
  selectedPaperId,
  onNodeClick
}) => {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive graph data with ghost nodes
  const graphData = useMemo(() => {
    const nodes: any[] = papers.map(p => ({ 
      id: p.id, 
      doi: p.doi,
      title: p.title,
      isGhost: false,
      val: 1 
    }));

    const ghostNodesMap = new Map<string, any>();
    
    const formattedLinks = links.map(l => {
      // Find source node (can be by DOI or ID)
      const sourceNode = nodes.find(n => n.doi === l.source || n.id === l.source);
      // Find target node (by DOI)
      let targetNode = nodes.find(n => n.doi === l.target);

      if (!targetNode) {
        if (!ghostNodesMap.has(l.target)) {
          const ghost = { id: l.target, doi: l.target, title: `Ghost: ${l.target}`, isGhost: true, val: 0.5 };
          ghostNodesMap.set(l.target, ghost);
        }
        targetNode = ghostNodesMap.get(l.target);
      }

      return {
        source: sourceNode ? sourceNode.id : l.source,
        target: targetNode ? targetNode.id : l.target
      };
    });

    return {
      nodes: [...nodes, ...Array.from(ghostNodesMap.values())],
      links: formattedLinks.filter(l => l.source && l.target) // safety check
    };
  }, [papers, links]);

  useEffect(() => {
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

  useEffect(() => {
    if (selectedPaperId && fgRef.current) {
      const node = graphData.nodes.find(n => n.id === selectedPaperId);
      if (node && node.x !== undefined && node.y !== undefined) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(3, 1000);
      }
    }
  }, [selectedPaperId, graphData.nodes]);

  const handleNodeClick = useCallback((node: any) => {
    if (!node.isGhost) {
      onNodeClick(node.id);
    } else {
      // Ghost node click: maybe prompt user to add paper? For now, do nothing.
      alert(`This is a ghost node for DOI: ${node.doi}. Add it to the collection to edit.`);
    }
  }, [onNodeClick]);

  const bgColor = '#0f172a';
  const nodeColor = '#60a5fa';
  const ghostNodeColor = '#94a3b8';
  const selectedNodeColor = '#a78bfa';
  const linkColor = 'rgba(255, 255, 255, 0.2)';
  const textColor = '#f8fafc';

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden" ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeId="id"
          nodeColor={(node: any) => node.isGhost ? ghostNodeColor : (node.id === selectedPaperId ? selectedNodeColor : nodeColor)}
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
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            ctx.fillStyle = bgColor;
            ctx.globalAlpha = 0.8;
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - 10 - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
            
            ctx.globalAlpha = 1;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.id === selectedPaperId ? selectedNodeColor : (node.isGhost ? ghostNodeColor : textColor);
            ctx.fillText(label, node.x, node.y - 10);

            // Draw Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
            
            if (node.isGhost) {
              ctx.strokeStyle = ghostNodeColor;
              ctx.setLineDash([2, 2]); // Dashed line for ghost nodes
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.setLineDash([]); // Reset
            } else {
              ctx.fillStyle = node.id === selectedPaperId ? selectedNodeColor : nodeColor;
              ctx.fill();
              if (node.id === selectedPaperId) {
                 ctx.strokeStyle = '#fff';
                 ctx.lineWidth = 1;
                 ctx.stroke();
              }
            }
          }}
        />
      )}
    </div>
  );
};
