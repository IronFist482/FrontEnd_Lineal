import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import StepCard from '../components/StepCard';
import { procesarMatriz } from '../api/api';
import Modal from '../components/ui/modal';
import '../styles/Home.css';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [modalOpen, setModalOpen] = useState(false);
  const [contador, setContador] = useState(0);

  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const [operationCache, setOperationCache] = useState({
    Determinante: { file: null, result: null, error: null },
    Inversa: { file: null, result: null, error: null },
    SEL: { file: null, result: null, error: null },
  });

  const opKey = selectedOperation === 'S.E.L.' ? 'SEL' : selectedOperation;
  const currentData = operationCache[opKey];
  const currentResult = currentData.result;
  const currentError = currentData.error;

  const runOperation = useCallback(async (operation, file) => {
    setIsLoading(true);
    const operationKey = operation === 'S.E.L.' ? 'SEL' : operation;

    try {
      const operationToSend = operationKey;
      const data = await procesarMatriz(operationToSend, file);

      setOperationCache((prevCache) => ({
        ...prevCache,
        [operationKey]: { file: file, result: data, error: null },
      }));
    } catch (err) {
      const errorMessage = err.message || 'Ocurrió un error al procesar el archivo.';
      console.error('Error al procesar la matriz:', err);

      setOperationCache((prevCache) => ({
        ...prevCache,
        [operationKey]: { file: file, result: null, error: errorMessage },
      }));
    } finally {
      setIsLoading(false);
      
    }
  }, []);

  const getOperacionDescripcion = (op) => {
    if (!op || op.length === 0) return 'Operación desconocida';

    const tipo = op[0];
    switch (tipo) {
      case 1:
        if (op.length >= 3) return `Intercambio de filas F${op[1]} ↔ F${op[2]}`;
        return 'Intercambio de filas';
      case 2:
        if (op.length >= 2) return `La fila pivote se multiplicó por ${op[1]}`;
        return 'Escalamiento de fila';
      case 3:
        return 'Se hicieron ceros debajo del pivote';
      case 4:
        return 'Se hicieron ceros arriba del pivote';
      default:
        return 'Operación desconocida';
    }
  };

  const handleFileSelect = (file) => {
    runOperation(selectedOperation, file);
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

  const formatComentario = (comentario) => {
    if (typeof comentario === 'string') return comentario;

    if (typeof comentario === 'object' && comentario !== null) {
      return Object.entries(comentario)
        .map(([key, value]) => {
          if (typeof value === 'string' && value.includes('ℝ')) {
            return `${key} ${value}`;
          }
          return `${key} = ${value}`;
        })
        .join(', ');
    }

    return 'Respuesta no válida.';
  };

  const renderSteps = () => {
    if (!currentResult?.matrices_pasos?.length) {
      return <p>No hay pasos para mostrar.</p>;
    }

    const pasos = currentResult.matrices_pasos;
    const operaciones = currentResult.matrices_pasos_id || [];

    const combined = pasos.map((matriz, index) => ({
      stepNumber: index + 1,
      operationName: currentResult.operacion || 'Operación',
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
    const operationKey = selectedOperation === 'S.E.L.' ? 'SEL' : selectedOperation;
    setOperationCache((prevCache) => ({
      ...prevCache,
      [operationKey]: { file: null, result: null, error: null },
    }));
    setShowAllSteps(false);
    setContador(contador + 1);
    if (contador % 3 === 2) {
      setModalOpen(true);
    }
  };

  return (
    <div className="home-root">
      <div className="home-container">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={setSelectedOperation}
          onResetClick={handleReset}
        />

        <div className="home-content-area">
          {!isLoading && !currentError && !currentResult && (
            <FileUploadArea onFileSelect={handleFileSelect} />
          )}

          {isLoading && (
            <div className="loading-indicator">Procesando matriz...</div>
          )}

          {currentError && (
            <div className="error-message">
              <strong>Error:</strong> {currentError}
              <button onClick={handleReset} className="reset-btn-error">
                Intentar de nuevo
              </button>
            </div>
          )}

          {currentResult && (
            <>
              <div className="matriz-inicial-display">
                <span className="resultado-titulo">Matriz Original:</span>
                <div className="matrix-container">
                  {renderMatrix(currentResult.matriz_inicial)}
                </div>
              </div>

              <div className="results-animation-wrapper">
                <div className="resultado-final math-result">
                  <span className="resultado-titulo">Resultado:</span>
                  <p className="resultado-texto">
                    {formatComentario(currentResult.comentario)}
                  </p>
                </div>

                <div className="steps-wrapper">{renderSteps()}</div>
              </div>
            </>
          )}
        </div>
        <Modal open={modalOpen} onOpenChange={setModalOpen}/>

        {!isLoading && !currentError && !currentResult && (
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