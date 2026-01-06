import React, { useState } from 'react';
import type { SeatLocation } from '../logic/orchestra';
import '../assets/Stage.css'; 

interface GuestFormProps {
  emptySeats: SeatLocation[];
  onSave: (name: string, seat: SeatLocation) => void;
  onCancel: () => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ emptySeats, onSave, onCancel }) => {
  const [name, setName] = useState('');
  
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return; // to not submit empty names
    
    // get the selected seat
    if (emptySeats.length > 0) {
      onSave(name, emptySeats[selectedSeatIndex]);
    } else {
      alert("No empty seats available for a new guest.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Guest Player</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Guest Name"
              autoFocus
            />
          </div>

          {/* Seat Selector */}
          <div className="form-group">
            <label>Assign Seat:</label>
            <select 
              value={selectedSeatIndex}
              onChange={(e) => setSelectedSeatIndex(Number(e.target.value))}
              disabled={emptySeats.length === 0}
            >
              {emptySeats.length === 0 ? (
                <option>No seats available</option>
              ) : (
                emptySeats.map((seat, index) => (
                  <option key={`${seat.desk}-${seat.pos}`} value={index}>
                    Desk {seat.desk} - {seat.pos}
                  </option>
                ))
              )}
            </select>
            {emptySeats.length === 0 && (
              <p className="hint-text">Remove a player first to free up a seat.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!name.trim() || emptySeats.length === 0}
            >
              Add Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};