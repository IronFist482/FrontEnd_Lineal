import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import StepCard from '../components/StepCard';
import { procesarMatriz } from '../api/api';
import '../styles/Home.css';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const runOperation = useCallback(async (operation, file) => {
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    setApiResult(null);

    try {
      const operationToSend =
        operation === 'S.E.L.' ? 'SEL' : operation;

      const data = await procesarMatriz(operationToSend, file);
      setApiResult(data);
      setShowResults(true);
    } catch (err) {
      console.error('Error al procesar la matriz:', err);
      setError(err.message || 'Ocurrió un error al procesar el archivo.');
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (uploadedFile) {
      runOperation(selectedOperation, uploadedFile);
    } else {
      setUploadedFile(null);
      setShowResults(false);
      setApiResult(null);
      setError(null);
    }
  }, [selectedOperation, uploadedFile, runOperation]);

  const getOperacionDescripcion = (op) => {
    switch (op[0]) {
      case 1:
        return `Intercambio de filas F${op[1]} ↔ F${op[2]}`;
      case 2:
        return `Se dividió la fila pivote entre ${op[1]}`;
      case 3:
        return `Se hicieron ceros debajo del pivote`;
      case 4:
        return `Se hicieron ceros arriba del pivote`;
      default:
        return `Operación desconocida`;
    }
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const renderMatrix = (mat) => (
    <table className="matrix">
      <tbody>
        {mat.map((row, i) => (
          <tr key={i}>
            {row.map((value, j) => (
              <td key={j}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSteps = () => {
    if (!apiResult?.matrices_pasos || apiResult.matrices_pasos.length === 0) {
      return <p>No hay pasos para mostrar.</p>;
    }

    const pasos = apiResult.matrices_pasos;
    const operaciones = apiResult.matrices_pasos_id || [];

    const combined = pasos.map((matriz, index) => ({
      stepNumber: index + 1,
      operationName: apiResult.operacion || 'Operación',
      operationDetail: getOperacionDescripcion(operaciones[index] || []),
      matrix: matriz,
    }));

    const stepsToDisplay = showAllSteps ? combined : combined.slice(0, 1);

    return (
      <>
        {stepsToDisplay.map((s) => (
          <StepCard
            key={s.stepNumber}
            stepNumber={s.stepNumber}
            operationName={s.operationName}
            operationDetail={s.operationDetail}
            matrix={s.matrix}
          />
        ))}

        {combined.length > 1 && (
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="show-all-btn"
          >
            {showAllSteps ? 'Ocultar pasos' : 'Ver pasos completos'}
          </button>
        )}
      </>
    );
  };

  const handleReset = () => {
    setUploadedFile(null);
    setShowAllSteps(false); 
  };

  return (
    <div className="home-root">
      <div className="home-container">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={setSelectedOperation}
        />

        <div className="home-content-area">
          {!isLoading && !error && !showResults && (
            <FileUploadArea onFileSelect={handleFileSelect} />
          )}

          {isLoading && (
            <div className="loading-indicator">Procesando matriz...</div>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
              <button onClick={handleReset} className="reset-btn-error">
                Intentar de nuevo
              </button>
            </div>
          )}

          {showResults && apiResult && (
            <>
              <div className="matriz-inicial-display">
                <span className="resultado-titulo">Matriz Original:</span>
                <div className="matrix-container">
                  {renderMatrix(apiResult.matriz_inicial)}
                </div>
              </div>

              <div className="results-animation-wrapper">
                <div className="resultado-final">
                  <span className="resultado-titulo">Resultado:</span>
                  <p className="resultado-texto">{apiResult.comentario}</p>
                </div>

                <div className="steps-wrapper">{renderSteps()}</div>
              </div>

              <button onClick={handleReset} className="reset-btn">
                Procesar otra matriz
              </button>
            </>
          )}
        </div>

        {!showResults && !isLoading && !error && (
          <div className="flow-indicator-wrapper">
            <div className="flow-step">
              <div className="flow-step-number-box">
                <span className="flow-step-number">1</span>
              </div>
              <span className="flow-step-text">Seleccionar operación</span>
            </div>
            <div className="flow-separator"></div>
            <div className="flow-step">
              <div className="flow-step-number-box">
                <span className="flow-step-number">2</span>
              </div>
              <span className="flow-step-text">Subir archivo .txt</span>
            </div>
            <div className="flow-separator"></div>
            <div className="flow-step">
              <div className="flow-step-number-box">
                <span className="flow-step-number">3</span>
              </div>
              <span className="flow-step-text">Ver resultado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}