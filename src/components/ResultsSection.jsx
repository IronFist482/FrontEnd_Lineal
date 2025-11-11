import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import StepCard from './StepCard';
import '../styles/ResultsSection.css';
import { BlockMath } from 'react-katex'; 
import { toFrac } from '../utils/formatFraction';

// Importa la función de utilidad creada en el paso 1
import takeScreenshotAndGetBase64 from '../utils/screenshotUtils'; 


// -----------------------------------------------------------
// MatrixRenderer function (La mantendremos sin cambios)
// -----------------------------------------------------------
export function MatrixRenderer({ data, operationType }) {
  if (!data || data.length === 0) {
    return <span>Matriz no disponible</span>;
  }

  const numCols = data[0].length;
  const isAugmented = numCols > data.length;

  const rows = data
    .map((row, i) => {
      const formattedRow = row.map(value => toFrac(value)).join(' & ');
      return i < data.length - 1 ? `${formattedRow} \\\\[0.5em]` : formattedRow;
    })
    .join(' ');

  let latex;
  switch (operationType) {
    case 'Determinante':
      latex = `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
      break;

    case 'SEL':
      const arrayColsSEL = 'c '.repeat(numCols - 1) + '| c';
      latex = `\\left[\\begin{array}{${arrayColsSEL}} ${rows} \\end{array}\\right]`;
      break;

    case 'Inversa':
      if (isAugmented) {
        const halfCols = numCols / 2;
        const arrayColsInv = 'c '.repeat(halfCols) + '| ' + 'c '.repeat(halfCols - 1) + 'c';
        latex = `\\left[\\begin{array}{${arrayColsInv}} ${rows} \\end{array}\\right]`;
      } else {
        latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
      }
      break;

    default:
      latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  }
  return (
    <div className="matrix-display-latex">
      <BlockMath math={latex} />
    </div>
  );
}


// -----------------------------------------------------------
// ResultsSection function (MODIFICADA PARA CAPTURA AUTOMÁTICA)
// -----------------------------------------------------------
export function ResultsSection({ 
    result, 
    explanation, 
    originalMatrix, 
    lastMatrix, 
    fullSteps, 
    operationType,
    setShowSteps, 
    showSteps,
    onScreenshotReady // 👈 Nueva prop: función para enviar la imagen a Home
}) {
  const finalMatrixTitle = operationType === 'Determinante' ? 'Matriz Triangular' : 'Matriz Final';
  
  // 1. Usar un ID fijo y un estado para evitar la captura múltiple
  const CAPTURE_ID = "solver-results-card"; 
  const [hasCaptured, setHasCaptured] = useState(false);

  // 2. Disparar la captura en cuanto el componente reciba los datos y se monte
  useEffect(() => {
    // La captura solo se ejecuta si hay un resultado y no ha sido capturado antes
    if (result && originalMatrix && !hasCaptured) {
      
      const captureAndSend = async () => {
        // Espera un pequeño tiempo para asegurar que KaTeX (BlockMath) se haya renderizado
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        const imageBase64 = await takeScreenshotAndGetBase64(CAPTURE_ID); 

        if (imageBase64 && onScreenshotReady) {
          // 3. Enviar la Data URL (imagen) al componente padre (Home.jsx)
          onScreenshotReady(imageBase64); 
          setHasCaptured(true); // Marca como capturado
        }
      };

      captureAndSend();
    }

    // Resetear el estado de captura si los resultados cambian o se vacían
    if (!result) {
        setHasCaptured(false);
    }

  }, [result, originalMatrix, hasCaptured, onScreenshotReady]); 

  return (
    // 4. Asignar el ID al contenedor que deseas capturar
    <Card className="results-section-root" id={CAPTURE_ID}>
      
      {(originalMatrix || lastMatrix) && (
        <>
          <div className="results-section-matrices-container">
            {originalMatrix && (
              <div className="results-section-matrix-box">
                <h4 className="results-section-title">Matriz Original</h4>
                <MatrixRenderer data={originalMatrix} operationType={operationType} />
              </div>
            )}
            
            {lastMatrix && (
              <div className="results-section-matrix-box">
                <h4 className="results-section-title">{finalMatrixTitle}</h4> 
                <MatrixRenderer data={lastMatrix} operationType={operationType} />
              </div>
            )}
            
          </div>
          <div className="results-section-result-wrapper">
              <h3 className="results-section-title">Resultado</h3>
              <div className="results-section-result-box">
                <h6 className="results-section-result-text">{result}</h6>
              </div>
          </div>
        </>
      )}

      {showSteps && (
        <div className="full-steps-list">
          {fullSteps.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={index + 1}
              operationName={step.operationName}
              operationDetail={step.operationDetail}
              matrix={step.matrix} 
              operationType={operationType} 
            />
          ))}
        </div>
      )}
        

    </Card>
  );
}