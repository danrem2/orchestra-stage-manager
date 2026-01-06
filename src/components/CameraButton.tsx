import React from 'react';

interface CameraButtonProps {
  onClick: () => void;
  className?: string;
  title?: string;
}

export const CameraButton: React.FC<CameraButtonProps> = ({ 
  onClick, 
  className = "btn-quick-save", 
  title = "Take Snapshot" 
}) => {
  return (
    <button 
      className={className} 
      onClick={onClick}
      title={title}
      type="button"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
    </button>
  );
};