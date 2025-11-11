import { useState } from 'react';
import { Card } from './ui/card';
import StepCard from './StepCard';
import '../styles/ResultsSection.css';
import { BlockMath } from 'react-katex'; 
import { toFrac } from '../utils/formatFraction';


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


export function ResultsSection({ 
    result, 
    explanation, 
    originalMatrix, 
    lastMatrix, 
    fullSteps, 
    operationType,
    setShowSteps, 
    showSteps
}) {
  const finalMatrixTitle = operationType === 'Determinante' ? 'Matriz Triangular' : 'Matriz Final';
  

  return (
    <Card className="results-section-root" /*id={cardId}*/>
      
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
                <p className="results-section-result-text">{result}</p> 
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