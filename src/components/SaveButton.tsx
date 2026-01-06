interface SaveButtonProps {
  onClick: () => void;
  title?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  title = "Quick Save" 
}) => {
  return (
    <button 
      className="btn-quick-save" 
      onClick={onClick}
      title={title}
    >
      {/* Floppy Disk Icon */}
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
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
    </button>
  );
};