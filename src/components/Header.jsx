import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';

// La interfaz HeaderProps se elimina

export function Header(props) {
  // Desestructuración de props sin tipado explícito
  const { selectedOperation, onOperationChange } = props;
  const operations = ['Determinante', 'S.E.L.', 'Inversa'];

  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
      {/* Logos y texto - Izquierda */}
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-2">
            <ImageWithFallback
              src="https://images.seeklogo.com/logo-png/7/2/ipn-logo-png_seeklogo-73340.png"
              alt="Logo IPN"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-2">
            <ImageWithFallback
              src="https://www.escom.ipn.mx/images/logoESCOM2x.png"
              alt="Logo ESCOM"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="text-gray-700 ml-2">2BM2</div>
      </div>

      {/* Título - Centro */}
      <Card className="w-full lg:flex-1 rounded-2xl shadow-lg border-0 bg-white px-6 py-4 lg:px-8 lg:py-6 flex items-center justify-center">
        <h1 className="text-gray-800">Gauss Jordan</h1>
      </Card>

      {/* Botones de operación - Derecha (horizontal en móvil, vertical en desktop) */}
      <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto justify-between lg:justify-start">
        {operations.map((operation) => (
          <Button
            key={operation}
            // La función se llama directamente sin tipado de argumento
            onClick={() => onOperationChange(operation)}
            variant={selectedOperation === operation ? 'default' : 'outline'}
            className={`
              flex-1 lg:flex-none lg:min-w-[140px] rounded-xl shadow-md transition-all duration-200
              ${
                selectedOperation === operation
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-white hover:bg-indigo-50 hover:border-indigo-300 text-gray-700'
              }
            `}
          >
            {operation}
          </Button>
        ))}
      </div>
    </header>
  );
}