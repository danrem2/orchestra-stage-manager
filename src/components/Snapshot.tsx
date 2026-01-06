
import React from 'react';

interface SnapshotModalProps {
  imageSrc: string;       
  stageName: string;       
  onClose: () => void;     
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ imageSrc, stageName, onClose }) => {
  
  // trigger the file download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${stageName}-Snapshot.png`; // Set the filename
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px', maxWidth: '95%' }}>
        
        {/* Header */}
        <h3>Stage Snapshot</h3>

        {/* The Image Preview */}
        <div style={{ 
            background: '#f0f0f0', 
            padding: '10px', 
            borderRadius: '4px',
            textAlign: 'center',
            height: '60vh', 
            display: 'flex',
            justifyContent: 'center',   
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <img 
                src={imageSrc} 
                alt="Stage Preview" 
                style={{ maxWidth: '100%',
                         maxHeight: '100%',
                         display: 'block',
                         objectFit: 'contain',
                         boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }} 
            />
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <button className="btn-primary" onClick={handleDownload}>
            Download Image 
          </button>
        </div>

      </div>
    </div>
  );
};