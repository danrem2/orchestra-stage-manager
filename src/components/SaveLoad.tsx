import React, { useState } from 'react';

interface SaveLoadProps {
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  isLoading?: boolean;
  message?: string | null;
}

export const SaveLoad: React.FC<SaveLoadProps> = ({ onSave, onLoad, isLoading = false, message }) => {
  const [name, setName] = useState("");

  return (
    <div className="save-load-container">
      {/* Input Field */}
      <input 
        type="text" 
        className="stage-name-input"
        placeholder="Enter Stage Code..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />

      {/* Action Buttons */}
      <div className="save-load-actions">
        <button 
          className="btn-save"
          onClick={() => name && onSave(name)}
          disabled={!name || isLoading}
          title="Save to Cloud"
        >
          {isLoading ? "..." : "Save"}
        </button>

        <button 
          className="btn-load"
          onClick={() => name && onLoad(name)}
          disabled={!name || isLoading}
          title="Load from Cloud"
        >
          {isLoading ? "..." : "Load"}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p className="save-load-message">{message}</p>
      )}
    </div>
  );
};