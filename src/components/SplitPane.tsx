import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './SplitPane.css';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialLeftWidth?: number; // percentage (0-100)
  minLeftWidth?: number; // px
  minRightWidth?: number; // px
}

export const SplitPane: React.FC<SplitPaneProps> = ({ 
  left, 
  right, 
  initialLeftWidth = 35,
  minLeftWidth = 300,
  minRightWidth = 400
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth); // in percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const newLeftWidthPx = e.clientX - containerRef.current.getBoundingClientRect().left;

      // Constraints
      if (newLeftWidthPx < minLeftWidth) return;
      if (containerWidth - newLeftWidthPx < minRightWidth) return;

      const newLeftWidthPercent = (newLeftWidthPx / containerWidth) * 100;
      setLeftWidth(newLeftWidthPercent);
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, minLeftWidth, minRightWidth]);

  return (
    <div className="split-pane-container" ref={containerRef}>
      <div className="split-pane-left" style={{ width: `${leftWidth}%` }}>
        {left}
      </div>
      <div 
        className={`split-pane-divider ${isDragging ? 'dragging' : ''}`} 
        onMouseDown={onMouseDown}
      >
        <div className="divider-handle"></div>
      </div>
      <div className="split-pane-right" style={{ width: `${100 - leftWidth}%` }}>
        {right}
      </div>
    </div>
  );
};
