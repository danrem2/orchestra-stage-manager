import React from 'react';
import styled from 'styled-components';

// 1. Accept props (onClick, title)
type ClearButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

const ClearButton = ({ onClick, title }: ClearButtonProps) => {
  return (
    <StyledWrapper>
      <div className="styled-wrapper">
        <button className="button" onClick={onClick} title={title}>
          <div className="button-box">
            <span className="button-elem">
              {/* Only ONE SVG needed now */}
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
            </span>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .styled-wrapper .button {
    display: block;
    position: relative;
    width: 50px; 
    height: 50px;
    margin: 0;
    overflow: hidden;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    border: 0;
  }

  /* --- Ring Animation (Kept this as it looks nice with the spin) --- */
  .styled-wrapper .button:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 7px;
    border: 2px solid #e57373;
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }

  .styled-wrapper .button:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 7px;
    border: 2px solid #e57373;
    transform: scale(1.3);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
  }

  .styled-wrapper .button:hover:before,
  .styled-wrapper .button:focus:before {
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .styled-wrapper .button:hover:after,
  .styled-wrapper .button:focus:after {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }
  /* --------------------------------------------------------- */


  .styled-wrapper .button-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .styled-wrapper .button-elem {
    display: block;
    width: 20px;
    height: 20px;
    fill: #e57373;
    /* Add smooth transition for rotation */
    transition: transform 0.5s ease-in-out;
  }

  .styled-wrapper .button:hover .button-elem,
  .styled-wrapper .button:focus .button-elem {
    /* Rotate 360 degrees on hover */
    transform: rotate(360deg);
  }

`;

export default ClearButton;