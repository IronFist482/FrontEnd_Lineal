import { useState, useCallback } from "react";
import { Header } from "../components/Header";
import { FileUploadArea } from "../components/FileUploadArea";
import { ResultsSection } from "../components/ResultsSection";
import { procesarMatriz } from "../api/api";
import { validateMatrixForSubmit } from "../components/ui/EditableMatrix";
import { matrixToFraction } from "../utils/formatFraction";
import { analyzeOperation } from "../utils/matrixAnalyzer";
import InstructionsModal from "../components/ui/InstructionsModal";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import "../styles/Home.css";

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState("Determinante");
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const ERROR_MESSAGES = {
    FETCH_FAILED: "No se pudo recuperar la información. Problema del servidor.",
    INVALID_MATRIX: "La matriz proporcionada no es válida. Revisa el archivo TXT.",
    FILE_TOO_LARGE: "El archivo es demasiado grande. Intenta con uno más pequeño.",
    UNSUPPORTED_FORMAT: "Formato de archivo no soportado. Debe ser .txt.",
    SERVER_ERROR: "Ocurrió un error en el servidor. Intenta más tarde.",
    UNKNOWN: "Ocurrió un error desconocido. Intenta nuevamente.",
  };

  const [operationCache, setOperationCache] = useState({
    Determinante: { file: null, result: null, error: null },
    Inversa: { file: null, result: null, error: null },
    SEL: { file: null, result: null, error: null },
  });

  const operationMap = {
    Determinante: "Determinante",
    Inversa: "Inversa",
    "S.E.L.": "SEL",
  };

  const handleMatrixError = (message) => setErrorMessage(message);

  const generateTxtContent = (matrix) =>
    matrix
      .map((row) =>
        row.map((cell) => (cell !== undefined && cell !== null ? cell : "")).join(",")
      )
      .join("\n");

  const handleMatrixChange = (matrix) => {
    const file = new File([generateTxtContent(matrix)], "matriz.txt", {
      type: "text/plain",
    });
    runOperation(selectedOperation, file);
  };

  const handleFileUpload = (file) => runOperation(selectedOperation, file);

  const runOperation = useCallback(
    async (operation, file) => {
      setIsLoading(true);
      const operationKey = operationMap[operation] || operation;
      try {
        const data = await procesarMatriz(operationKey, file);
        setErrorMessage(null);
        setOperationCache((prev) => ({
          ...prev,
          [operationKey]: { file, result: data, error: null },
        }));
      } catch (err) {
        let message;
        if (err.message?.includes("Failed to fetch")) message = ERROR_MESSAGES.FETCH_FAILED;
        else if (err.message?.includes("Invalid matrix")) message = ERROR_MESSAGES.INVALID_MATRIX;
        else if (err.message?.includes("File too large")) message = ERROR_MESSAGES.FILE_TOO_LARGE;
        else if (err.message?.includes("Unsupported format")) message = ERROR_MESSAGES.UNSUPPORTED_FORMAT;
        else if (err.message?.includes("500")) message = ERROR_MESSAGES.SERVER_ERROR;
        else if (err.message?.includes("Error!, Recuerda que solo se aceptan matrices con numeros y con el formato correcto")) message = ERROR_MESSAGES.INVALID_MATRIX;
        else message = ERROR_MESSAGES.UNKNOWN;

        setErrorMessage(message);
        setOperationCache((prev) => ({
          ...prev,
          [operationKey]: { file, result: null, error: message },
        }));
      }
      setTimeout(() => setIsLoading(false), 600);
    },
    [operationMap]
  );

  const handleProcessEditedMatrix = (matrix) => {
    const validationError = validateMatrixForSubmit(matrix);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    const file = new File([generateTxtContent(matrix)], "matriz_editada.txt", {
      type: "text/plain",
    });
    runOperation(selectedOperation, file);
  };

  const handleReset = () => {
    const opKey = operationMap[selectedOperation] || selectedOperation;
    setOperationCache((prev) => ({
      ...prev,
      [opKey]: { file: null, result: null, error: null },
    }));
    setErrorMessage(null);
  };

  const opKey = operationMap[selectedOperation] || selectedOperation;
  const currentData = operationCache[opKey] || { file: null, result: null, error: null };
  const currentResult = currentData.result;
  const currentError = currentData.error;

  const originalMatrix = currentResult?.matriz_inicial
    ? matrixToFraction(currentResult.matriz_inicial)
    : null;
  const lastMatrix =
    currentResult?.matrices_pasos?.length > 0
      ? matrixToFraction(currentResult.matrices_pasos.slice(-1)[0])
      : null;

  // Generar pasos con análisis detallado de operaciones
  const fullSteps =
    (currentResult?.matrices_pasos || []).map((matrix, index) => {
      let operationName = `Paso ${index + 1}`;
      let operationDetail = null;
      
      const pasoId = currentResult?.matrices_pasos_id?.[index];
      
      // Obtener las matrices antes y después para análisis
      const matrixBefore = index === 0 
        ? currentResult.matriz_inicial 
        : currentResult.matrices_pasos[index - 1];
      const matrixAfter = matrix;
      
      // Generar nombre de operación basado en pasoId
      if (pasoId?.[0] === 1) {
        operationName = `Intercambio de filas`;
      } else if (pasoId?.[0] === 2) {
        operationName = `Multiplicar fila por escalar`;
      } else if (pasoId?.[0] === 3) {
        operationName = `Hacer ceros debajo del pivote`;
      } else if (pasoId?.[0] === 4) {
        operationName = `Hacer ceros arriba del pivote`;
      }
      
      // Analizar la operación para obtener detalles
      if (pasoId && matrixBefore && matrixAfter) {
        operationDetail = analyzeOperation(matrixBefore, matrixAfter, pasoId);
      }
      
      return {
        operationName,
        operationDetail,
        matrix: matrixToFraction(matrix),
      };
    }) || [];

  return (
    <div className="home-root">
      <div className="home-container">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={(op) => {
            setSelectedOperation(op);
            setErrorMessage(null);
          }}
          onResetClick={handleReset}
        />

        {!isLoading && !currentError && !currentResult && (
          <>
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

            <div
              className="flow-indicator-wrapper instructions-button"
              onClick={() => setInstructionsModalOpen(true)}
            >
              <div className="flow-step">
                <div className="flow-step-number-box">
                  <span className="flow-step-number">?</span>
                </div>
                <span className="flow-step-text">
                  ¿Cómo ingresar los datos para operar?
                </span>
              </div>
            </div>
          </>
        )}

        <div className="home-content-area">
          {errorMessage && (
            <div className="error-banner">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                   10-4.48 10-10S17.52 2 12 2zm0 18
                   c-4.41 0-8-3.59-8-8s3.59-8 8-8
                   8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
              {errorMessage}
            </div>
          )}

          {!isLoading && !currentResult && (
            <FileUploadArea
              onFileSelect={handleFileUpload}
              onMatrixChange={handleMatrixChange}
              onError={handleMatrixError}
              operationtype={opKey}
            />
          )}

          <LoadingOverlay visible={isLoading} />

          {currentResult && (
            <ResultsSection
              result={currentResult.comentario}
              originalMatrix={originalMatrix}
              lastMatrix={lastMatrix}
              fullSteps={fullSteps}
              operationType={opKey}
              onProcessAgain={handleProcessEditedMatrix}
            />
          )}

          <InstructionsModal
            open={instructionsModalOpen}
            onOpenChange={setInstructionsModalOpen}
          />
        </div>
      </div>
    </div>
  );
}