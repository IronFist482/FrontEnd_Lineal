import React from 'react';
import "../styles/Header.css";

export function Header({ selectedOperation, onOperationChange, onResetClick }) {
  const operations = ['Determinante', 'S.E.L.', 'Inversa'];

  return (
    <header className="header-container">

      <div className="header-top-row">
        <div className="logo-box" onClick={onResetClick}>
          <img src="https://images.seeklogo.com/logo-png/7/2/ipn-logo-png_seeklogo-73340.png" alt="IPN" />
        </div>

        <div className="header-title">
          <h1>Gauss Jordan</h1>
        </div>

        <div className="logo-box" onClick={onResetClick}>
          <img src="https://www.escom.ipn.mx/images/logoESCOM2x.png" alt="ESCOM" />
        </div>
      </div>

      <div className="operation-buttons">
        {operations.map(op => (
          <button
            key={op}
            onClick={() => onOperationChange(op)}
            className={`operation-btn ${selectedOperation === op ? "active" : ""}`}
          >
            {op}
          </button>
        ))}
      </div>

    </header>

  );
}
