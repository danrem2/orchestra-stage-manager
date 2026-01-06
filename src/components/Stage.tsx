import React from 'react';
import { Orchestra } from '../logic/orchestra';
import { Desk } from './Desk';
import { DEFAULT_NUM_DESKS } from '../logic/config';

interface StageProps {
  orchestra: Orchestra;
  selectedPlayers: number[];
  toggleSelection: (playerId: number) => void;
}

export const Stage: React.FC<StageProps> = ({ orchestra, selectedPlayers, toggleSelection }) => {
  
  
  const deskNumbers = Array.from({ length: DEFAULT_NUM_DESKS + 1 }, (_, i) => i + 1);

  return (
    <div className="stage-wrapper">
      {deskNumbers.map(i => {
        // Find the seats for this desk
        const leftSeat = orchestra.seats.find(s => s.deskNumber === i && s.position === 'Left');
        const rightSeat = orchestra.seats.find(s => s.deskNumber === i && s.position === 'Right');

        // Safety check - should always find both seats
        if (!leftSeat || !rightSeat) return null;

        return (
          <Desk 
            key={i} 
            deskNumber={i}
            leftSeat={leftSeat}
            rightSeat={rightSeat}
            selectedPlayerIds={selectedPlayers}
            onPlayerClick={toggleSelection}
          />
        );
      })}
    </div>
  );
};