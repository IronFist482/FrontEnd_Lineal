import React from 'react';
import '../../styles/LoadingOverlay.css';

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loader"></div>
      <p className="loading-text">Procesando matriz...</p>
    </div>
  );
}
