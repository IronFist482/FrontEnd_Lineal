import { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import '../../styles/inputMatrix.css';

const OPERATION_TITLES = {
  Determinante: 'Ingrese su matriz',
  Inversa: 'Ingrese su matriz',
  SEL: 'Ingrese su sistema de ecuaciones lineales',
};

const getDefaultMatrices = () => ({
  SEL: Array.from({ length: 2 }, () => Array(3).fill('')),
  Determinante: Array.from({ length: 2 }, () => Array(2).fill('')),
  Inversa: Array.from({ length: 2 }, () => Array(2).fill('')),
});

export function InputMatrix({ onMatrixChange, maxSize = 10, operationtype }) {
  const [matrices, setMatrices] = useState(getDefaultMatrices());
  const [focusCell, setFocusCell] = useState({ r: 0, c: 0 });
  const inputRefs = useRef([]);
  
  const matrix = matrices[operationtype] || getDefaultMatrices()[operationtype];

  // Detectar móvil
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Inicializar refs
  useEffect(() => {
    inputRefs.current = matrix.map((row, r) =>
      inputRefs.current[r]?.slice(0, row.length) || Array(row.length).fill(null)
    );
  }, [matrix]);

  // Mantener foco
  useEffect(() => {
    if (focusCell) {
      const { r, c } = focusCell;
      inputRefs.current[r]?.[c]?.focus();
    }
  }, [matrices, focusCell]);

  const updateMatrix = (newMatrix) => {
    setMatrices(prev => ({
      ...prev,
      [operationtype]: newMatrix,
    }));
  };

  const handleCellChange = (r, c, value) => {
    const isValid = value === '' || /^-?\d*\.?\d*$/.test(value);
    if (!isValid) return;
    const newMatrix = matrix.map(row => [...row]);
    newMatrix[r][c] = value;
    updateMatrix(newMatrix);
  };

  // Manejo de teclas y botones
  const moveFocus = (direction) => {
    let { r, c } = focusCell;
    let expand = false;

    if (direction === 'up') r = Math.max(r - 1, 0);
    if (direction === 'down') {
      r = r + 1;
      if (r >= matrix.length) expand = true;
    }
    if (direction === 'left') c = Math.max(c - 1, 0);
    if (direction === 'right') {
      c = c + 1;
      if (c >= matrix[0].length) expand = true;
    }

    // Expansión de matriz
    if ((operationtype === 'Determinante' || operationtype === 'Inversa') && expand && matrix.length < maxSize) {
      const newSize = matrix.length + 1;
      const expanded = Array.from({ length: newSize }, (_, i) =>
        Array.from({ length: newSize }, (_, j) => matrix[i]?.[j] ?? '')
      );
      updateMatrix(expanded);
      setFocusCell({ r: newSize - 1, c: newSize - 1 });
      return;
    }

    if (operationtype === 'SEL' && expand) {
      if (direction === 'down' && matrix.length < maxSize) {
        updateMatrix([...matrix, Array(matrix[0].length).fill('')]);
        setFocusCell({ r: matrix.length, c });
        return;
      }
      if (direction === 'right' && matrix[0].length < maxSize) {
        const newMatrix = matrix.map(row => [...row, '']);
        updateMatrix(newMatrix);
        setFocusCell({ r, c: matrix[0].length });
        return;
      }
    }

    setFocusCell({ r, c });
  };

  const handleKeyDown = (e, r, c) => {
    if (!isMobile) {
      const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        setFocusCell({ r, c }); // actualiza foco
        moveFocus(keyMap[e.key]);
      }
    }
  };

  const handleReset = () => {
    setMatrices(prev => ({
      ...prev,
      [operationtype]: getDefaultMatrices()[operationtype],
    }));
    setFocusCell({ r: 0, c: 0 });
  };

  // Generar LaTeX
  const getWrapper = () => {
    const cols = matrix[0]?.length || 2;
    let latexBody = '';

    switch (operationtype) {
      case 'Determinante':
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left|\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right|`;
      case 'Inversa':
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left[\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right]`;
      case 'SEL': {
        const coefCols = matrix[0].length - 1;
        const phantoms = Array.from({ length: coefCols }, (_, i) => `\\phantom{00\\,x_{${i + 1}}\\,+}`);
        const latexRows = matrix.map(() => {
          const coeficientes = phantoms.join(' & ');
          return `${coeficientes} & \\phantom{=} & \\phantom{00}`;
        }).join('\\\\');
        return `\\displaystyle \\left\\{\\begin{array}{${'l'.repeat(coefCols)}r c}${latexRows}\\end{array}\\right.`;
      }
      default:
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left(\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right)`;
    }
  };

  return (
    <div className="matrix-container">
      <div className="matrix-title-wrapper">
        <h3 className="matrix-title">{OPERATION_TITLES[operationtype]}</h3>
      </div>

      <button type="button" className="button button-reset" onClick={handleReset}>
        Reiniciar
      </button>

      {isMobile && (
        <div className="matrix-navigation">
          <button className="button button-outline" onClick={() => moveFocus('up')}>↑</button>
          <button className="button button-outline" onClick={() => moveFocus('down')}>↓</button>
          <button className="button button-outline" onClick={() => moveFocus('left')}>←</button>
          <button className="button button-outline" onClick={() => moveFocus('right')}>→</button>

          {/* Expansión rápida en móvil */}
          {(operationtype === 'SEL' || operationtype === 'Determinante' || operationtype === 'Inversa') && (
            <>
              <button className="button button-outline" onClick={() => moveFocus('down')}>+ Fila</button>
              <button className="button button-outline" onClick={() => moveFocus('right')}>+ Columna</button>
            </>
          )}
        </div>
      )}

      <div className="matrix-overlay-wrapper">
        <div className="katex-wrapper">
          <BlockMath math={getWrapper()} />
        </div>

        <table className="matrix-input-overlay small-inputs">
          <tbody>
            {matrix.map((r, rowIndex) => {
              let cells = [];
              if (operationtype === 'SEL') {
                const coefCells = [];
                for (let colIndex = 0; colIndex < r.length - 1; colIndex++) {
                  coefCells.push(
                    <td key={`cell-${rowIndex}-${colIndex}`} className="matrix-variable-cell">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={r[colIndex]}
                        ref={el => {
                          if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                          inputRefs.current[rowIndex][colIndex] = el;
                        }}
                        onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
                      />
                      <span className="matrix-variable-label">
                        <InlineMath math={`x_{${colIndex + 1}}`} />
                      </span>
                      {colIndex < r.length - 2 && <span className="matrix-plus-sign"><InlineMath math="+" /></span>}
                    </td>
                  );
                }
                const resultColIndex = r.length - 1;
                cells = [
                  ...coefCells,
                  <td key={`equals-${rowIndex}`} className="matrix-equals-sign">=</td>,
                  <td key={`cell-${rowIndex}-${resultColIndex}`}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={r[resultColIndex]}
                      ref={el => {
                        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                        inputRefs.current[rowIndex][resultColIndex] = el;
                      }}
                      onChange={e => handleCellChange(rowIndex, resultColIndex, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, rowIndex, resultColIndex)}
                    />
                  </td>
                ];
              } else {
                cells = r.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={cell}
                      ref={el => {
                        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                        inputRefs.current[rowIndex][colIndex] = el;
                      }}
                      onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
                    />
                  </td>
                ));
              }
              return <tr key={rowIndex}>{cells}</tr>;
            })}
          </tbody>
        </table>
      </div>

      <div className="matrix-process-btn-wrapper">
        <button type="button" className="button button-default" onClick={() => onMatrixChange(matrix)}>
          Procesar matriz
        </button>
      </div>
    </div>
  );
}
