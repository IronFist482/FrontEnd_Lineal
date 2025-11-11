import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import StepCard from './StepCard';
import '../styles/ResultsSection.css';
import { EditableMatrix } from './ui/EditableMatrix';

export function ResultsSection({
  result,
  explanation,
  originalMatrix,
  lastMatrix,
  fullSteps,
  operationType,
  onProcessAgain
}) {
  const [showSteps, setShowSteps] = useState(false);
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [editedMatrix, setEditedMatrix] = useState(originalMatrix);

  useEffect(() => {
    setEditedMatrix(originalMatrix);
  }, [originalMatrix]);

  const handleProcessAgain = () => {
    if (onProcessAgain) {
      onProcessAgain(editedMatrix);
      setIsEditingOriginal(false);
    }
  };
  
  const isDeterminantError = comentario === "La determinante solo se puede obtener de matrices cuadradas";

  const finalMatrixTitle = operationType === 'Determinante' ? 'Matriz Triangular' : 'Matriz Final';
  const showOriginal = originalMatrix != null;
  const showLast = lastMatrix != null && (operationType === 'SEL' || operationType === 'Inversa');


  return (
    <Card className="results-section-root">
      {(showOriginal || showLast) && (
        <div className="results-section-matrices-container">

          {showOriginal && (
            <div className="results-section-matrix-box">
              <h4 className="matrix-subtitle">Original</h4>
              <EditableMatrix
                data={isEditingOriginal ? editedMatrix : originalMatrix}
                operationType={operationType}
                isEditable={isEditingOriginal}
                onMatrixEdit={setEditedMatrix}
              />

              <div className="matrix-edit-controls">
                {isEditingOriginal ? (
                  <>
                    <button
                      type="button"
                      className="button button-success"
                      onClick={handleProcessAgain}
                    >
                      Procesar matriz editada
                    </button>
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={() => {
                        setEditedMatrix(originalMatrix);
                        setIsEditingOriginal(false);
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => setIsEditingOriginal(true)}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Matriz final / solo lectura */}
          {(operationType === 'SEL' || operationType === 'Inversa') && showLast && (
            <div className="results-section-matrix-box">
              <h4 className="matrix-subtitle">{finalMatrixTitle}</h4>
              <EditableMatrix data={lastMatrix} operationType={operationType} />
            </div>
          )}

          {operationType === 'Determinante' && showLast && (
            <div className="results-section-matrix-box">
              <h4 className="matrix-subtitle">{finalMatrixTitle}</h4>
              <EditableMatrix data={lastMatrix} operationType={operationType} />
            </div>
          )}

          {/* Resultado */}
          <div className="results-section-result-wrapper">
            <h3 className="results-section-title">Resultado</h3>
            <div className="results-section-result-box">
              <p
                className="results-section-result-text"
                style={{ fontSize: '1.4rem', lineHeight: '1.6' }}
              >
                {result}
              </p>
            </div>
          </div>

        </div>
      )}

      {fullSteps && fullSteps.length > 0 && (
            <>
              <button
                type="button"
                className="button button-default"
                onClick={() => setShowSteps(!showSteps)}
              >
                {showSteps ? "Ocultar pasos completos" : "Ver pasos completos"}
              </button>

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
        </>
      )}
    </Card>
  );
}
