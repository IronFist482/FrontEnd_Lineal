import { useState } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import { ResultsSection } from '../components/ResultsSection';
import { procesarMatriz } from '../api/api';
import '../styles/Home.css';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    console.log("Archivo seleccionado:", file);
    return;
    setUploadedFile(file);
    setIsLoading(true);    
    setError(null);         
    setShowResults(false); 
    setApiResult(null); 
    console.log("Archivo seleccionado:", file);    

    try {
      const operationToSend = selectedOperation === 'S.E.L.' ? 'SEL' : selectedOperation;

      const data = await procesarMatriz(operationToSend, file);

      setApiResult(data);
      setShowResults(true);

    } catch (err) {
      console.error("Error al procesar la matriz:", err);
      setError(err.message || 'Ocurrió un error al procesar el archivo.');
      setShowResults(false); 
    } finally {
      setIsLoading(false); 
    }
  };

 
  const formatExplanation = (pasos) => {
    if (!pasos || !Array.isArray(pasos) || pasos.length === 0) {
      return ['Cálculo directo, no se requieren pasos intermedios.'];
    }

    return pasos.map((paso, index) =>
      `Paso ${index + 1}: ${JSON.stringify(paso)}`
    );
  };

  return (
    <div className="home-root">
      <div className="home-container">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={setSelectedOperation}
        />

        <div className="home-content-area">
          <FileUploadArea onFileSelect={handleFileSelect} />


          {isLoading && (
            <div className="loading-indicator">
              Procesando matriz...
            </div>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {showResults && apiResult && (
            <div className="results-animation-wrapper">
              <ResultsSection
                result={apiResult.comentario}
                explanation={formatExplanation(apiResult.matrices_pasos)}
              />
            </div>
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
