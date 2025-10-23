import { useState } from 'react';
import { Header } from './components/Header';
import { FileUploadArea } from './components/FileUploadArea';
import { ResultsSection } from './components/ResultsSection';

export default function Home() {
  const [selectedOperation, setSelectedOperation] = useState('Determinante');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    // Simular procesamiento y mostrar resultados
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  };

  // Datos de ejemplo para los resultados
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
    <div className="min-h-screen bg-[#8ED6E8] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          selectedOperation={selectedOperation}
          onOperationChange={setSelectedOperation}
        />

        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Área de trabajo */}
          <FileUploadArea onFileSelect={handleFileSelect} />

          {/* Sección de resultados */}
          {showResults && uploadedFile && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultsSection
                result={currentResult.result}
                explanation={currentResult.explanation}
              />
            </div>
          )}
        </div>

        {/* Indicador de flujo visual - Oculto en móvil, visible desde tablet */}
        {!showResults && (
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm md:text-base">1</span>
              </div>
              <span className="text-xs md:text-sm">Seleccionar operación</span>
            </div>
            <div className="w-0.5 h-8 md:w-8 md:h-0.5 bg-white/40"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm md:text-base">2</span>
              </div>
              <span className="text-xs md:text-sm">Subir archivo .txt</span>
            </div>
            <div className="w-0.5 h-8 md:w-8 md:h-0.5 bg-white/40"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm md:text-base">3</span>
              </div>
              <span className="text-xs md:text-sm">Ver resultado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
