import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  message,
  onClose,
  duration = 6000
}) => {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (show && !isHovering) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, isHovering, duration, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-3 transition-opacity"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span>⚠️ {message}</span>
      <button 
        onClick={onClose} 
        className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-red-700 focus:outline-none"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};
