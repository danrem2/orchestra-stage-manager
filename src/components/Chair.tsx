import React from 'react';
import { Player } from '../logic/orchestra';
import '../assets/stage.css'; 

interface ChairProps {
  player: Player | null;      
  label: 'L' | 'R';           
  isSelected: boolean;        
  onClick: () => void;        
}

export const Chair: React.FC<ChairProps> = ({ player, label, isSelected, onClick }) => {
  
// Determine CSS classes based on state
  let cssClass = 'chair';
  if (!player) {
    cssClass += ' empty';     
  } else if (isSelected) {
    cssClass += ' selected';  
  }


  const handleClick = () => {
    if (player) {
      onClick();
    }
  };

  return (
    <div className="player-container">
      <span className="player-name">
        {player ? player.name : "Empty"}
      </span>
      <div className={cssClass} onClick={handleClick}>
        {label}
      </div>
    </div>
  );
};