import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import { ResultsSection } from '../components/ResultsSection';
import { procesarMatriz, mandarFoto } from '../api/api';
import { toFrac, matrixToFraction } from "../utils/formatFraction";
import { InlineMath } from 'react-katex';
import InstructionsModal from '../components/ui/InstructionsModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';

import '../styles/Home.css';
import 'katex/dist/katex.min.css';
import { toast } from 'sonner';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [contador, setContador] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);

  const [operationCache, setOperationCache] = useState({
    Determinante: { file: null, result: null, error: null, image:null },
    Inversa: { file: null, result: null, error: null,image:null },
    SEL: { file: null, result: null, error: null,image:null  },
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

  // ... (código previo)

  // Función auxiliar para convertir Base64 a File/Blob
// Puedes poner esta función dentro de tu archivo Home.jsx o en un archivo de utilidades
const base64ToFile = (base64, filename) => {
    try {
        const parts = base64.split(';base64,');
        const mime = parts[0].split(':')[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new ArrayBuffer(n);
        const uint8Array = new Uint8Array(u8arr);

        while(n--){
            uint8Array[n] = bstr.charCodeAt(n);
        }

        const blob = new Blob([uint8Array], { type: mime });
        return new File([blob], filename, { type: mime });
    } catch (e) {
        console.error("Error converting Base64 to File:", e);
        return null;
    }
};

  const handleScreenshotReady = async(base64Image) => {
    //Quiero que cambie el estado de operationCache para marcar que ya tiene imagen
    setOperationCache(prevCache => {
      const opKey = operationMap[selectedOperation] || selectedOperation;
      const updatedOperation = {
        ...prevCache[opKey],
        image: base64Image,
      };
      return {
        ...prevCache,
        [opKey]: updatedOperation,
      };
    });
    setScreenshotData(base64Image); // Si quieres mantenerlo en el estado
    
    // La matriz para el Form-Field 'matriz'
    const matriz_data = currentData.result?.matriz_inicial;

    if (!matriz_data) {
        toast.error('No hay datos de matriz para enviar.');
        return;
    }
    const file = base64ToFile(base64Image, 'matriz_resultado.png');

    if (!file) {
        toast.error('Error al procesar la imagen.');
        return;
    }

    try {
        // 3. Crear el objeto FormData
        const formData = new FormData();
        // El campo 'archivo' debe ser el objeto File/Blob
        formData.append('archivo', file); 
        // El campo 'matriz' debe ser la cadena de texto
        // Si 'matriz_data' es un array, debes serializarlo (ej. a JSON string)
        const matrizString = JSON.stringify(matriz_data);
        formData.append('matriz', matrizString); 
        
        // 4. Llamar a la función API con el FormData
        if(!operationCache[selectedOperation].image){
          const imageUploadResponse = await mandarFoto(formData);
          const message = imageUploadResponse?.message || 'Imagen subida con éxito.';
          toast.success(message);
        }
        
    } catch (error) {
        console.error(error);
        toast.error('Error al subir la imagen de la matriz.');
    }
};

// ... (código posterior)

  const handleFileUpload = (file) => {
    runOperation(selectedOperation, file);
  };

  const runOperation = useCallback(async (operation, file) => {
    setIsLoading(true);
    const operationKey = operationMap[operation] || operation;
    try {
      const data = await procesarMatriz(operationKey, file);
      if (data){
        console.log("Datos recibidos:", data);
        
      }
      setOperationCache(prev => ({
        ...prev,
        [operationKey]: { file, result: data, error: null },
      }));
      
    } catch (err) {
      const message = err?.message || 'Ocurrió un error al procesar el archivo.';
      setOperationCache(prev => ({
        ...prev,
        [operationKey]: { file, result: null, error: message },
      }));
    }
    setTimeout(() => setIsLoading(false), 900);
  }, [operationMap]);


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
  const fullSteps = (currentResult?.matrices_pasos || []).map((matrix, i) => {
    const desc = getOperacionDescripcion((currentResult?.matrices_pasos_id || [])[i]);
    return { operationName: desc.name, operationDetail: desc.detail, matrix: matrixToFraction(matrix) };
  }) || [];

  return (
    <div className="home-root">
      <div className="home-container">
        <Header selectedOperation={selectedOperation} onOperationChange={setSelectedOperation} onResetClick={handleReset} />

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
              setShowSteps={setShowSteps}
              showSteps={showSteps}
              onScreenshotReady={handleScreenshotReady}
            />
          )}
        </div>
        {currentResult && (
        <button
          className="ver-pasos-btn"
          onClick={() => setShowSteps(!showSteps)}
        >
          {showSteps ? "Ocultar pasos" : "Ver pasos completos"}
        </button>
        )}
        <InstructionsModal open={instructionsModalOpen} onOpenChange={setInstructionsModalOpen} />

      </div>
    </div>
  );
}
