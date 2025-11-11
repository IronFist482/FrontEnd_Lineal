import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import { ResultsSection } from '../components/ResultsSection';
import { procesarMatriz } from '../api/api';
import { toFrac, matrixToFraction } from "../utils/formatFraction";
import { InlineMath } from 'react-katex';
import InstructionsModal from '../components/ui/InstructionsModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import '../styles/Home.css';
import 'katex/dist/katex.min.css';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [contador, setContador] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const ERROR_MESSAGES = {
    FETCH_FAILED: "No se pudo recuperar la información. Problema del servidor.",
    INVALID_MATRIX: "La matriz proporcionada no es válida. Revisa el archivo TXT.",
    FILE_TOO_LARGE: "El archivo es demasiado grande. Intenta con uno más pequeño.",
    UNSUPPORTED_FORMAT: "Formato de archivo no soportado. Debe ser .txt.",
    SERVER_ERROR: "Ocurrió un error en el servidor. Intenta más tarde.",
    UNKNOWN: "Ocurrió un error desconocido. Intenta nuevamente."
  };



  const [operationCache, setOperationCache] = useState({
    Determinante: { file: null, result: null, error: null },
    Inversa: { file: null, result: null, error: null },
    SEL: { file: null, result: null, error: null },
  });

  const operationMap = {
    Determinante: 'Determinante',
    Inversa: 'Inversa',
    'S.E.L.': 'SEL',
  };

  const generateTxtContent = (matrix) => {
    return matrix
      .map(row =>
        row
          .map(cell => {
            const num = parseFloat(cell);
            return isNaN(num) ? '' : num;
          })
          .join(',')
      )
      .join('\n');
  };

  const handleMatrixChange = (matrix) => {
    const content = generateTxtContent(matrix);
    const file = new File([content], 'matriz.txt', { type: 'text/plain' });
    runOperation(selectedOperation, file);
  };

  const handleFileUpload = (file) => {
    runOperation(selectedOperation, file);
  };

  const runOperation = useCallback(async (operation, file) => {
    setIsLoading(true);
    const operationKey = operationMap[operation] || operation;
    try {
      const data = await procesarMatriz(operationKey, file);
      setErrorMessage(null);
      setOperationCache(prev => ({
        ...prev,
        [operationKey]: { file, result: data, error: null },
      }));
    } catch (err) {
      let message;
      if (err.message?.includes("Failed to fetch")) {
        message = ERROR_MESSAGES.FETCH_FAILED;
      } else if (err.message?.includes("Invalid matrix")) {
        message = ERROR_MESSAGES.INVALID_MATRIX;
      } else if (err.message?.includes("File too large")) {
        message = ERROR_MESSAGES.FILE_TOO_LARGE;
      } else if (err.message?.includes("Unsupported format")) {
        message = ERROR_MESSAGES.UNSUPPORTED_FORMAT;
      } else if (err.message?.includes("500")) {
        message = ERROR_MESSAGES.SERVER_ERROR;
      } else {
        message = ERROR_MESSAGES.UNKNOWN;
      } setErrorMessage(message);
      setOperationCache(prev => ({

        ...prev,
        [operationKey]: { file, result: null, error: message },
      }));
    }
    setTimeout(() => setIsLoading(false), 900);
  }, [operationMap]);

  const handleProcessEditedMatrix = (matrix) => {
    const content = generateTxtContent(matrix);
    const file = new File([content], 'matriz_editada.txt', { type: 'text/plain' });
    runOperation(selectedOperation, file);
  };

  const getOperacionDescripcion = (op) => {
    if (!Array.isArray(op) || op.length === 0) return { name: 'Operación desconocida', detail: '' };
    const tipo = op[0];
    if (tipo === 1) {
      const origen = op[1], destino = op[2];
      return { name: `Intercambio de filas F${origen} ↔ F${destino}`, detail: <InlineMath math={`F_{${origen}} \\leftrightarrow F_{${destino}}`} /> };
    }
    if (tipo === 2) {
      const factor = toFrac(op[1]);
      return { name: "Multiplicación de fila", detail: <InlineMath math={`\\frac{1}{${factor}} \\cdot F_p \\rightarrow F_p`} /> };
    }
    if (tipo === 3 || tipo === 4) {
      const fila = op[1];
      return { name: tipo === 3 ? 'Ceros debajo del pivote' : 'Ceros arriba del pivote', detail: <InlineMath math={`F_{${fila + 1}}, C_{${fila + 1}}`} /> };
    }
    return { name: `Operación desconocida (tipo ${tipo})`, detail: <InlineMath math={JSON.stringify(op)} /> };
  };

  const handleReset = () => {
    const opKey = operationMap[selectedOperation] || selectedOperation;
    setOperationCache(prev => ({ ...prev, [opKey]: { file: null, result: null, error: null } }));
    setContador(c => c + 1);
    setErrorMessage(null);
  };

  const opKey = operationMap[selectedOperation] || selectedOperation;
  const currentData = operationCache[opKey] || { file: null, result: null, error: null };
  const currentResult = currentData.result;
  const currentError = currentData.error;

  const formatComentario = (comentario) => {
    if (typeof comentario === "string") return <p className="results-section-result-text">{comentario}</p>;
    if (typeof comentario === "object" && comentario !== null) {
      const latexContent = Object.entries(comentario).map(([key, value]) => `${key} = ${toFrac(value)}`).join(', ');
      return <div className="latex-result-box"><InlineMath math={latexContent} /></div>;
    }
    return <p className="results-section-result-text">Respuesta no válida.</p>;
  };

  const originalMatrix = currentResult?.matriz_inicial ? matrixToFraction(currentResult.matriz_inicial) : null;
  const lastMatrix = currentResult?.matrices_pasos?.length > 0
    ? matrixToFraction(currentResult.matrices_pasos.slice(-1)[0])
    : null;

  const explanationSteps = (currentResult?.matrices_pasos_id || []).map(op => getOperacionDescripcion(op).name) || [];
  const fullSteps = (currentResult?.matrices_pasos || [])
  .map((matrix, i) => {
    const desc = getOperacionDescripcion((currentResult?.matrices_pasos_id || [])[i]);
    if (desc.name.startsWith('Operación desconocida')) return null;
    return { operationName: desc.name, operationDetail: desc.detail, matrix: matrixToFraction(matrix) };
  })
  .filter(Boolean) || [];


  return (
    <div className="home-root">
      <div className="home-container">
        <Header selectedOperation={selectedOperation} onOperationChange={(op) => { setSelectedOperation(op); setErrorMessage(null); }}
          onResetClick={handleReset} />

        {!isLoading && !currentError && !currentResult && (
          <>
            <div className="flow-indicator-wrapper">
              <div className="flow-step"><div className="flow-step-number-box"><span className="flow-step-number">1</span></div><span className="flow-step-text">Seleccionar operación</span></div>
              <div className="flow-separator"></div>
              <div className="flow-step"><div className="flow-step-number-box"><span className="flow-step-number">2</span></div><span className="flow-step-text">Subir archivo .txt</span></div>
              <div className="flow-separator"></div>
              <div className="flow-step"><div className="flow-step-number-box"><span className="flow-step-number">3</span></div><span className="flow-step-text">Ver resultado</span></div>
            </div>

            <div className="flow-indicator-wrapper instructions-button" onClick={() => setInstructionsModalOpen(true)}>
              <div className="flow-step"><div className="flow-step-number-box"><span className="flow-step-number">?</span></div><span className="flow-step-text">¿Cómo debe ser el archivo TXT?</span></div>
            </div>
          </>
        )}

        <div className="home-content-area">
          {errorMessage && (
            <div className="error-banner">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
               10-4.48 10-10S17.52 2 12 2zm0 18
               c-4.41 0-8-3.59-8-8s3.59-8 8-8
               8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              {errorMessage}
            </div>
          )}


          {!isLoading && !currentResult && (
            <FileUploadArea
              onFileSelect={handleFileUpload}
              onMatrixChange={handleMatrixChange}
              operationtype={opKey}
            />
          )}

          <LoadingOverlay visible={isLoading} />

          {currentResult && (
            <ResultsSection
              result={formatComentario(currentResult.comentario)}
              explanation={explanationSteps}
              originalMatrix={originalMatrix}
              lastMatrix={lastMatrix}
              fullSteps={fullSteps}
              operationType={opKey}
              onProcessAgain={handleProcessEditedMatrix} 
            />
          )}

        </div>

        <InstructionsModal open={instructionsModalOpen} onOpenChange={setInstructionsModalOpen} />
      </div>
    </div>
  );
}
