import { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import '../../styles/inputMatrix.css';

export function InputMatrix({ onMatrixChange, maxSize = 10, operationtype }) {
  const [matrices, setMatrices] = useState({
    SEL: Array.from({ length: 2 }, () => Array(3).fill('')),
    Determinante: Array.from({ length: 2 }, () => Array(2).fill('')),
    Inversa: Array.from({ length: 2 }, () => Array(2).fill('')),
  });

  const [focusCell, setFocusCell] = useState(null);
  const inputRefs = useRef([]);
  const matrix = matrices[operationtype] || Array.from({ length: 2 }, () => Array(2).fill(''));

  useEffect(() => {
    inputRefs.current = matrix.map((row, r) =>
      inputRefs.current[r]?.slice(0, row.length) || Array(row.length).fill(null)
    );
  }, [matrix]);

  useEffect(() => {
    if (focusCell) {
      const { r, c } = focusCell;
      inputRefs.current[r]?.[c]?.focus();
      setFocusCell(null);
    }
  }, [matrices, focusCell]);

  const updateMatrix = (newMatrix) => {
    setMatrices((prev) => ({
      ...prev,
      [operationtype]: newMatrix,
    }));
  };

  const handleCellChange = (r, c, value) => {
    const isValid = value === '' || /^-?\d*\.?\d*$/.test(value);
    if (!isValid) return;
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[r][c] = value;
    updateMatrix(newMatrix);
  };

  const handleKeyDown = (e, r, c) => {
    const key = e.key;
    let newR = r;
    let newC = c;
    let expand = false;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();

      if (key === 'ArrowUp') newR = Math.max(r - 1, 0);
      if (key === 'ArrowDown') {
        newR = r + 1;
        if (newR >= matrix.length) expand = true;
      }
      if (key === 'ArrowLeft') newC = Math.max(c - 1, 0);
      if (key === 'ArrowRight') {
        newC = c + 1;
        if (newC >= matrix[0].length) expand = true;
      }

      if ((operationtype === 'Determinante' || operationtype === 'Inversa') && expand) {
        if (matrix.length < maxSize) {
          const newSize = matrix.length + 1;
          const expanded = Array.from({ length: newSize }, (_, i) =>
            Array.from({ length: newSize }, (_, j) => matrix[i]?.[j] ?? '')
          );
          updateMatrix(expanded);
          setFocusCell({ r: newSize - 1, c: newSize - 1 });
          return;
        }
      }

      if (operationtype === 'SEL' && key === 'ArrowDown' && expand) {
        if (matrix.length < maxSize) {
          const newRowIndex = matrix.length;
          updateMatrix([...matrix, Array(matrix[0].length).fill('')]);
          setFocusCell({ r: newRowIndex, c });
          return;
        }
      }
      
      if (operationtype === 'SEL' && key === 'ArrowRight' && expand) {
        if (matrix[0].length < maxSize) {
            const newColIndex = matrix[0].length;
            const newMatrix = matrix.map(row => {
                const newRow = [...row];
                newRow.splice(newColIndex - 1, 0, '');
                return newRow;
            });
            updateMatrix(newMatrix);
            setFocusCell({ r, c: newColIndex - 1 });
            return;
        }
      }

      if (inputRefs.current[newR]?.[newC]) {
        inputRefs.current[newR][newC].focus();
      }
    }
  };

  const getWrapper = () => {
    const cols = matrix[0]?.length || 2;
    let latexBody = '';

    switch (operationtype) {
      case 'Determinante':
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left|\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right|`;

      case 'Inversa':
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left[\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right]^{-1}`;

      case 'SEL': {
        const coefCols = matrix[0].length - 1;
        
        // 1. CREAR PHANTOMS NUEVOS
        // Creamos phantoms que incluyan el input (00), la variable (x_i) y el signo (+)
        const phantoms = Array.from({ length: coefCols }, (_, i) => {
          const varPhantom = `x_{${i + 1}}`;
          // Añadir phantom para '+' si NO es el último coeficiente
          const plusPhantom = (i < coefCols - 1) ? `+` : ``; 
          // `\,` añade un pequeño espacio
          return `\\phantom{00\\,${varPhantom}\\,${plusPhantom}}`; 
        });

        const latexRows = matrix
          .map(() => {
            const coeficientes = phantoms.join(' & ');
            const resultado = `\\phantom{00}`; // El resultado es un input normal
            return `${coeficientes} & \\phantom{=} & ${resultado}`;
          })
          .join('\\\\');
        
        // 2. ALINEAR A LA IZQUIERDA
        // Cambiamos 'c' (center) por 'l' (left) para que se vea bien
        return `\\displaystyle \\left\\{\\begin{array}{${'l'.repeat(coefCols)}r c}${latexRows}\\end{array}\\right.`;
      }
      default:
        latexBody = matrix.map(() => Array(cols).fill('\\phantom{00}').join(' & ')).join('\\\\');
        return `\\displaystyle \\left(\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right)`;
    }
  };

  return (
    <div className="matrix-container">
      <div className="matrix-overlay-wrapper">
        <div className="katex-wrapper">
          <BlockMath math={getWrapper()} />
        </div>

        <table className="matrix-input-overlay small-inputs">
          
          {/* 3. ELIMINAMOS EL THEAD */}
          
          <tbody>
            {matrix.map((r, rowIndex) => {
              let cells;

              // 4. LÓGICA DE CELDAS COMPLETAMENTE NUEVA
              if (operationtype === 'SEL') {
                const coefficientCells = [];
                // Iterar solo por los coeficientes (todos menos el último)
                for (let colIndex = 0; colIndex < r.length - 1; colIndex++) {
                  coefficientCells.push(
                    <td key={`cell-${rowIndex}-${colIndex}`} className="matrix-variable-cell">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={r[colIndex]}
                        ref={(el) => {
                          if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                          inputRefs.current[rowIndex][colIndex] = el;
                        }}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      />
                      <span className="matrix-variable-label">
                        <InlineMath math={`x_{${colIndex + 1}}`} />
                      </span>
                      {/* Añadir el '+' si no es la última variable */}
                      {colIndex < r.length - 2 && (
                        <span className="matrix-plus-sign">
                          <InlineMath math="+" />
                        </span>
                      )}
                    </td>
                  );
                }
                
                const resultColIndex = r.length - 1;
                cells = [
                  ...coefficientCells,
                  <td key={`equals-${rowIndex}`} className="matrix-equals-sign">=</td>,
                  <td key={`cell-${rowIndex}-${resultColIndex}`}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={r[resultColIndex]}
                      ref={(el) => {
                        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                        inputRefs.current[rowIndex][resultColIndex] = el;
                      }}
                      onChange={(e) => handleCellChange(rowIndex, resultColIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, resultColIndex)}
                    />
                  </td>
                ];

              } else {
                // Lógica original para Determinante e Inversa
                cells = r.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={cell}
                      ref={(el) => {
                        if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                        inputRefs.current[rowIndex][colIndex] = el;
                      }}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
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