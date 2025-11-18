import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import StepCard from './StepCard';
import '../styles/ResultsSection.css';
import { EditableMatrix } from './ui/EditableMatrix';
import { InlineMath, BlockMath } from 'react-katex';
import { toFrac } from '../utils/formatFraction';
import takeScreenshotAndGetBase64 from '../utils/screenshotUtils';

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
    case 'Determinante': {
      latex = `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
      break;
    }

    case 'SEL': {
      const arrayColsSEL = 'c '.repeat(numCols - 1) + '| c';
      latex = `\\left[\\begin{array}{${arrayColsSEL}} ${rows} \\end{array}\\right]`;
      break;
    }

    case 'Inversa': {
      if (isAugmented) {
        const halfCols = numCols / 2;
        const arrayColsInv = 'c '.repeat(halfCols) + '| ' + 'c '.repeat(halfCols - 1) + 'c';
        latex = `\\left[\\begin{array}{${arrayColsInv}} ${rows} \\end{array}\\right]`;
      } else {
        latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
      }
      break;
    }

    default: {
      latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
    }
  }
  return (
    <div className="matrix-display-latex">
      <BlockMath math={latex} />
    </div>
  );
}


export function ResultsSection({
    result,
    originalMatrix,
    lastMatrix,
    fullSteps,
    operationType,
    onProcessAgain,
    onScreenshotReady
}) {

    const [showSteps, setShowSteps] = useState(false);
    const [isEditingOriginal, setIsEditingOriginal] = useState(false);
    const [editedMatrix, setEditedMatrix] = useState(originalMatrix);
    const [hasCaptured, setHasCaptured] = useState(false);
    const CAPTURE_ID = "solver-results-card"; 

    useEffect(() => {
        if (!originalMatrix || !result || hasCaptured) {
            return;
        }

        const captureAndSend = async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const imageBase64 = await takeScreenshotAndGetBase64(CAPTURE_ID);
            console.log("Captured screenshot for ResultsSection.");
            
            if (imageBase64 && onScreenshotReady) {
                onScreenshotReady(imageBase64);
                setHasCaptured(true);
            }
        };

        captureAndSend();
    }, [result, originalMatrix, hasCaptured, onScreenshotReady]);

    useEffect(() => {
        if (!originalMatrix) {
            setHasCaptured(false);
        }
    }, [originalMatrix]);

    useEffect(() => {
        setEditedMatrix(originalMatrix);
    }, [originalMatrix]);

    const handleProcessAgain = () => {
        if (onProcessAgain) {
            onProcessAgain(editedMatrix);
            setIsEditingOriginal(false);
        }
    };

    const finalMatrixTitle = operationType === 'Determinante' ? 'Matriz Triangular' : 'Matriz Final';
    const showOriginal = originalMatrix != null;
    const showLast =
        lastMatrix != null &&
        operationType !== 'Determinante' &&
        (operationType === 'SEL' || operationType === 'Inversa');

    const renderResult = (res) => {
        if (res === null || res === undefined) {
            return <p className="results-section-result-text">Respuesta no válida.</p>;
        }


        if (typeof res === 'string') {
            const match = res.match(/-?\d+(\.\d+)?/);
            if (match) {
                const numberStr = match[0];
                const numValue = Number(numberStr);
                const latex = toFrac(Math.abs(numValue));
                const isNegative = numValue < 0;

                const mathToRender = isNegative ? `-${latex}` : latex;

                const index = match.index;
                const before = res.slice(0, index);
                const after = res.slice(index + numberStr.length);

                return (
                    <p className="results-section-result-text">
                        {before}
                        <InlineMath math={mathToRender} />
                        {after}
                    </p>
                );
            }
        }

        if (typeof res === 'number') {
            const isNegative = res < 0;
            const latex = toFrac(Math.abs(res));
            const mathToRender = isNegative ? `-${latex}` : latex;
            return <InlineMath math={mathToRender} />;
        }

        if (typeof res === 'object') {
            const latexContent = Object.entries(res)
                .map(([k, v]) => {
                    const isNegative = v < 0;
                    const latex = toFrac(Math.abs(v));
                    const mathToRender = isNegative ? `-${latex}` : latex;
                    return `${k} = ${mathToRender}`;
                })
                .join(', ');
            return <InlineMath math={latexContent} />;
        }

            return <p className="results-section-result-text">{res}</p>;
    };


    return (
        <Card className="results-section-root" id={CAPTURE_ID}>
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

                    {showLast && (
                        <div className="results-section-matrix-box">
                            <h4 className="matrix-subtitle">{finalMatrixTitle}</h4>
                            <EditableMatrix data={lastMatrix} operationType={operationType} />
                        </div>
                    )}

                    <div className="results-section-result-wrapper">
                        <h3 className="results-section-title">Resultado</h3>
                        <div
                            className="results-section-result-box"
                            style={{ fontSize: '1.4rem', lineHeight: '1.6' }}
                        >
                            {renderResult(result)}
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