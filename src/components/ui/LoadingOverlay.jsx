import React from 'react';
import '../../styles/LoadingOverlay.css';

export default function MatrixLoadingOverlay({ visible, message = "Calculando..." }) {
  if (!visible) return null;

  return (
    <div className="matrix-overlay" role="status" aria-busy="true">
      <div className="matrix-grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="matrix-cell">
            {Math.floor(Math.random() * 9)}
          </div>
        ))}
      </div>
      <p className="matrix-message">{message}</p>
    </div>
  );
}
