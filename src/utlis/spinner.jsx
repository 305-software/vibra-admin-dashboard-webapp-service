import React from 'react';

const Spinner = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh' // Ensures the container takes full viewport height
    }}>
      <div className="spinner" style={{
        width: '72px',
        height: '72px',
        display: 'grid',
        textAlign:'center'
      }}>
        <style>
          {`
            .spinner::before,
            .spinner::after {
              content: "";
              grid-area: 1/1;
              background: var(--c) 50% 0,
                          var(--c) 50% 100%,
                          var(--c) 100% 50%,
                          var(--c) 0 50%;
              background-size: 17.3px 17.3px;
              background-repeat: no-repeat;
              animation: spinner-3hs4a3 1s infinite;
            }

            .spinner::before {
              --c: radial-gradient(farthest-side,rgba(246, 176, 39, 1) 92%, transparent);
              margin: 5.8px;
              background-size: 11.5px 11.5px;
              animation-timing-function: linear;
            }

            .spinner::after {
              --c: radial-gradient(farthest-side, rgba(246, 176, 39, 1) 92%, transparent);
            }

            @keyframes spinner-3hs4a3 {
              100% {
                transform: rotate(0.5turn);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Spinner;
