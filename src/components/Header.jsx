import React from 'react';

export function Header(props) {
  const { selectedOperation, onOperationChange, onResetClick } = props;
  const operations = ['Determinante', 'S.E.L.', 'Inversa'];

  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex items-center gap-3 lg:gap-4">
          
          <div 
            className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-2 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={onResetClick}
          >
            <img
              src="https://images.seeklogo.com/logo-png/7/2/ipn-logo-png_seeklogo-73340.png"
              alt="Logo IPN"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/ffffff/c0c0c0?text=IPN"; }}
            />
          </div>
          
          <div 
            className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-2 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={onResetClick}
          >
            <img
              src="https://www.escom.ipn.mx/images/logoESCOM2x.png"
              alt="Logo ESCOM"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/ffffff/c0c0c0?text=ESCOM"; }}
            />
          </div>
        </div>

        
      </div>

      {/* Título - Centro */}
      <div className="w-full lg:flex-1 rounded-2xl shadow-lg border-0 bg-white px-6 py-4 lg:px-8 lg:py-6 flex items-center justify-center">
        <h1 className="text-gray-800">Gauss Jordan</h1>
      </div>

      <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto justify-between lg:justify-start">
        {operations.map((operation) => (
          <button
            key={operation}
            type="button"
            onClick={() => onOperationChange(operation)}
            className={`
              flex-1 lg:flex-none lg:min-w-[140px] rounded-xl shadow-md transition-all duration-200
              py-2 px-4 text-sm font-medium
              ${
                selectedOperation === operation
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-white hover:bg hover:border--green-300 text-gray-700 border border-gray-300'
              }
            `}
          >
            {operation}
          </button>
        ))}
      </div>
    </header>
  );
}