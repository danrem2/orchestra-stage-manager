import React from 'react';
import type { Player } from '../logic/orchestra';
import ClearButton from './ClearButton';
import AddButton from './AddButton';

interface ControlsProps {
  selectedCount: number;
  onClearSelection: () => void;
  removedPlayersList: Player[];
  removedGuestsList: Player[]; 
  onRotate: () => void;
  onRemove: () => void;
  onReset: () => void;
  onFillIn: () => void;
  onRestore: (player: Player) => void;
  warning?: string | null;
  onOpenGuestForm: () => void;
  onDeleteGuest: (id: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
    selectedCount,
    onClearSelection,
    removedPlayersList, 
    removedGuestsList,
    onRotate, 
    onRemove, 
    onReset, 
    onFillIn,
    onRestore,
    warning,
    onOpenGuestForm,
    onDeleteGuest
}) => {
  return (
    <div className="controls-panel">
      <h2>Controls</h2>

      {/* Warning message under headline */}
      {warning && (
        <div className="warning-message" style={{ color: 'red', margin: '8px 0', textAlign: 'center' }}>
          {warning}
        </div>
      )}
      
      {/* Status Info */}
      <div className="status-row">
        <p><strong>Selected Players:</strong> {selectedCount}</p>
        
        {/* Only show the 'X' if players are actually selected */}
        {selectedCount > 0 && (
          <ClearButton 
            onClick={onClearSelection} 
            title="Clear Selection" 
        />
        )}
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button 
          onClick={onReset}
          className="btn-secondary"
        >
          Reset Stage
        </button>

        <div className="action-row"> 
          
          <button 
            onClick={onRemove}
            disabled={selectedCount === 0}
            className={selectedCount > 0 ? "btn-action" : "btn-disabled"}
            title="Remove Selected"
          >
            Remove
          </button>

          <button 
            onClick={onFillIn}
            disabled={removedPlayersList.length === 0}
            className={removedPlayersList.length > 0 ? "btn-action" : "btn-disabled"}
            title="Fill Empty Seats"
          >
            Fill In
          </button>

          <button 
            onClick={onRotate}
            disabled={selectedCount < 2}
            className={selectedCount >= 2 ? "btn-action" : "btn-disabled"}
            title="Rotate Selected"
          >
            Rotate
          </button>

        </div>


        {/* --- GUEST SECTION --- */}
        <div className="removed-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Guests</h3>
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'right center' }}> 
                <AddButton onClick={onOpenGuestForm} />
                </div>
            </div>

            {/* Guest List */}
            <div className="removed-list">
            {removedGuestsList.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', margin: 0 }}>No guests waiting</p>
            ) : (
                removedGuestsList.map(guest => (
                <div key={guest.id} className="removed-item">
                    <span className="removed-name">{guest.name}</span>
                    <div className="guest-actions">
                        <button 
                        className="btn-restore"
                        onClick={() => onRestore(guest)}
                        title="Seat Guest"
                        >
                        +
                        </button>
                        <button 
                        onClick={() => onDeleteGuest(guest.id)}
                        className="btn-clear-selection" 
                        title="Delete Guest"
                        >
                        ✕
                        </button>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>


        {/* Removed Players List */}
        {removedPlayersList.length > 0 && (
        <div className="removed-section">
          <h3>Removed ({removedPlayersList.length})</h3>
          <div className="removed-list">
            {removedPlayersList.map(player => (
              <div key={player.id} className="removed-item">
                <span className="removed-name">{player.name}</span>
                <button 
                  className="btn-restore"
                  onClick={() => onRestore(player)}
                  title="Restore to stage"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      </div> 

      <div style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
        <p>Select 2 or more players to enable rotation.</p>
      </div>
    </div>
  );
};