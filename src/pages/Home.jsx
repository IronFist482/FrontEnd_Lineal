import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import { ResultsSection } from '../components/ResultsSection';
import { procesarMatriz } from '../api/api';
import { InlineMath } from 'react-katex';
import Modal from '../components/ui/modal';
import InstructionsModal from '../components/ui/InstructionsModal';
import '../styles/Home.css';
import 'katex/dist/katex.min.css';

export default function Home() {
  // --- Estado UI ---
  const [selectedOperation, setSelectedOperation] = useState('Determinante');

  // Estados separados para las modales
  const [restModalOpen, setRestModalOpen] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

  const [contador, setContador] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // caché por operación
  const [operationCache, setOperationCache] = useState({
    Determinante: { file: null, result: null, error: null },
    Inversa: { file: null, result: null, error: null },
    SEL: { file: null, result: null, error: null },
  });

  // Mapa para estandarizar claves de operación (evita errores con textos en UI)
  const operationMap = {
    Determinante: 'Determinante',
    Inversa: 'Inversa',
    'S.E.L.': 'SEL',
  };

  // clave actual en cache (SIEMPRE ES EL VALOR ESTANDARIZADO: 'SEL', 'Inversa', etc.)
  const opKey = operationMap[selectedOperation] || selectedOperation;
  const currentData = operationCache[opKey] || { file: null, result: null, error: null };
  const currentResult = currentData.result;
  const currentError = currentData.error;

  // --- Llamada a API para procesar la matriz ---
  const runOperation = useCallback(async (operation, file) => {
    setIsLoading(true);
    const operationKey = operationMap[operation] || operation;

    try {
      const data = await procesarMatriz(operationKey, file);

      setOperationCache((prevCache) => ({
        ...prevCache,
        [operationKey]: { file: file, result: data, error: null },
      }));
    } catch (err) {
      const errorMessage = err?.message || 'Ocurrió un error al procesar el archivo.';
      console.error('Error al procesar la matriz:', err);

      setOperationCache((prevCache) => ({
        ...prevCache,
        [operationKey]: { file: file, result: null, error: errorMessage },
      }));
    } finally {
      setIsLoading(false);
    }
  }, [operationMap]); 


  // --- getOperacionDescripcion ajustada al formato exacto de la API ---
  const getOperacionDescripcion = (op) => {
    if (!Array.isArray(op) || op.length === 0) {
      return { name: 'Operación desconocida', detail: '' };
    }
    const tipo = op[0];
    if (tipo === 1) {
      const origen = op[1];
      const destino = op[2];
      return {
        name: `Intercambio de filas F${origen} ↔ F${destino}`,
        detail: <InlineMath math={`F_{${origen}} \\rightarrow F_{${destino}}`} />,
      };
    }

    if (tipo === 2) {
      const factor = op[1];
      return {
        name: `Multiplicación de fila`,
        detail: <InlineMath math={`\\frac{1}{${factor}} \\cdot F_p \\rightarrow F_p`} />,
      };
    }

    if (tipo === 3 || tipo === 4) {
      const fila = op[1];
      const col = op[2];
      return {
        name: tipo === 3 ? 'Ceros debajo del pivote' : 'Ceros arriba del pivote',
        detail: (
          <>
            Hacer ceros en <InlineMath math={`F_{${fila + 1}}, C_{${col + 1}}`} />
          </>
        ),
      };
    }

    return {
      name: `Operación desconocida (tipo ${tipo})`,
      detail: <InlineMath math={JSON.stringify(op)} />,
    };
  };


  const handleFileSelect = (file) => {
    runOperation(selectedOperation, file);
  };

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

  // --- matriz original, final y pasos explicados ---
  const originalMatrix = currentResult?.matriz_inicial || null;
  const lastMatrix = currentResult?.matrices_pasos?.slice(-1)[0] || null;

  // explanationSteps: nombre corto para la lista ordenada
  const explanationSteps =
    (currentResult?.matrices_pasos_id || []).map((op) => {
      const desc = getOperacionDescripcion(op);
      return desc.name;
    }) || [];

  // fullSteps: objetos para StepCard con operationName, operationDetail y matrix
  const fullSteps =
    (currentResult?.matrices_pasos || []).map((matrix, index) => {
      const op = (currentResult?.matrices_pasos_id || [])[index];
      const desc = getOperacionDescripcion(op);
      return {
        operationName: desc.name,
        operationDetail: desc.detail,
        matrix,
      };
    }) || [];

  const handleReset = () => {
    const operationKey = opKey;
    setOperationCache((prevCache) => ({
      ...prevCache,
      [operationKey]: { file: null, result: null, error: null },
    }));
    setContador((c) => c + 1);

    if ((contador + 1) % 3 === 0) {
      setRestModalOpen(true);
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

        {/* Indicador de flujo principal */}
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

        {!isLoading && !currentError && !currentResult && (
          <div
            className="flow-indicator-wrapper instructions-button"
            onClick={() => setInstructionsModalOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="flow-step">
              <div className="flow-step-number-box">
                <span className="flow-step-number">?</span>
              </div>
              <span className="flow-step-text">¿Cómo debe ser el archivo TXT?</span>
            </div>
          </div>
        )}
        <div className="home-content-area">
          {/* Upload area */}
          {!isLoading && !currentError && !currentResult && (
            <FileUploadArea onFileSelect={handleFileSelect} />
          )}

          {/* Loading */}
          {isLoading && <div className="loading-indicator">Procesando matriz...</div>}

          {/* Error */}
          {currentError && (
            <div className="error-message">
              <strong>Error:</strong> {currentError}
              <button onClick={handleReset} className="reset-btn-error">
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Resultado final + ResultsSection */}
          {currentResult && (
            <ResultsSection
              result={formatComentario(currentResult.comentario)}
              explanation={explanationSteps}
              originalMatrix={originalMatrix}
              lastMatrix={lastMatrix}
              fullSteps={fullSteps}
              operationType={opKey}
            />
          )}
        </div>

        {/* Modal de Instrucciones (Formato TXT) */}
        <Modal
          open={instructionsModalOpen}
          onOpenChange={setInstructionsModalOpen}
          type="instructions"
        />

        {/* Modal de Descanso */}
        <Modal
          open={restModalOpen}
          onOpenChange={setRestModalOpen}
          type="rest"
        />

        <InstructionsModal
          open={instructionsModalOpen}
          onOpenChange={setInstructionsModalOpen}
        />
      </div>
    </div>
  );
}