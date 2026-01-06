import React from 'react';
import { Chair } from './Chair';
import { Seat } from '../logic/orchestra';

interface DeskProps {
  deskNumber: number;
  leftSeat: Seat;
  rightSeat: Seat;
  selectedPlayerIds: number[];  // List of currently selected player IDs
  onPlayerClick: (playerId: number) => void; 
}

export const Desk: React.FC<DeskProps> = ({  
  leftSeat, 
  rightSeat, 
  selectedPlayerIds, 
  onPlayerClick 
}) => {

  return (
    <div className="desk-group">
      {/* Left Chair */}
      <Chair 
        player={leftSeat.player}
        label="L"
        isSelected={leftSeat.player ? selectedPlayerIds.includes(leftSeat.player.id) : false}
        onClick={() => leftSeat.player && onPlayerClick(leftSeat.player.id)}
      />

      {/* The Music Stand */}
      <div className="music-stand"></div>

      {/* Right Chair */}
      <Chair 
        player={rightSeat.player}
        label="R"
        isSelected={rightSeat.player ? selectedPlayerIds.includes(rightSeat.player.id) : false}
        onClick={() => rightSeat.player && onPlayerClick(rightSeat.player.id)}
      />
    </div>
  );
};