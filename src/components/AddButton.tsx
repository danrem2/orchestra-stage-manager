import React from 'react';
import styled from 'styled-components';

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button type="button" className="button" onClick={onClick}>
        {/* Changed text to just "Add" for compactness */}
        <span className="button__text">Add</span>
        <span className="button__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height={24} fill="none" className="svg">
            <line y2={19} y1={5} x2={12} x1={12} />
            <line y2={12} y1={12} x2={19} x1={5} />
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    /* CHANGED: Shrunk width from 150px to 90px */
    width: 90px; 
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    /* CHANGED: Added to center the text horizontally */
    justify-content: center; 
    border: 1px solid #34974d;
    background-color: #3aa856;
    border-radius: 8px;
    overflow: hidden;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(0); 
    color: #fff;
    font-weight: 600;
    /* Added slight margin to balance visually against the hidden icon on the right */
    margin-right: 5px; 
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(90px); 
    height: 100%;
    width: 39px;
    background-color: #34974d;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
  }

  .button .svg {
    width: 24px; /* Slightly smaller icon to fit better */
    stroke: #fff;
  }

  .button:hover {
    background: #34974d;
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 100%;
    transform: translateX(0);
  }

  .button:active .button__icon {
    background-color: #2e8644;
  }

  .button:active {
    border: 1px solid #2e8644;
  }
`;

export default AddButton;