import { useState } from 'react';
import { Header } from '../components/Header';
import { FileUploadArea } from '../components/FileUploadArea';
import { ResultsSection } from '../components/ResultsSection';
import '../styles/Home.css';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  };

  const mockResults = {
    Determinante: {
      result: 'det(A) = 42',
      explanation: [
        'Se identifica la matriz A de dimensión n×n desde el archivo proporcionado.',
        'Se aplica el método de expansión por cofactores para calcular el determinante.',
        'Se realizan las operaciones algebraicas necesarias paso a paso.',
        'El resultado final del determinante es 42.',
      ],
    },
    'S.E.L.': {
      result: 'x₁ = 2, x₂ = -1, x₃ = 3',
      explanation: [
        'Se identifica el sistema de ecuaciones lineales desde el archivo.',
        'Se construye la matriz aumentada [A|b].',
        'Se aplica el método de eliminación gaussiana para reducir la matriz.',
        'Se obtienen las soluciones mediante sustitución hacia atrás.',
        'El sistema tiene solución única: x₁ = 2, x₂ = -1, x₃ = 3.',
      ],
    },
    Inversa: {
      result: 'A⁻¹ = [matriz 3×3]',
      explanation: [
        'Se verifica que la matriz A sea cuadrada e invertible (det(A) ≠ 0).',
        'Se construye la matriz aumentada [A|I] donde I es la identidad.',
        'Se aplica el método de Gauss-Jordan para transformar A en I.',
        'La matriz resultante del lado derecho es A⁻¹.',
        'Se obtiene la matriz inversa exitosamente.',
      ],
    },
  };

  const currentResult = mockResults[selectedOperation];

  return (
    <div className="home-root">
      <div className="home-container">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={setSelectedOperation}
        />

        <div className="home-content-area">
          {/* Área de trabajo */}
          <FileUploadArea onFileSelect={handleFileSelect} />

          {/* Sección de resultados */}
          {showResults && uploadedFile && (
            <div className="results-animation-wrapper">
              <ResultsSection
                result={currentResult.result}
                explanation={currentResult.explanation}
              />
            </div>
          )}
        </div>

        {/* Indicador de flujo visual */}
        {!showResults && (
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