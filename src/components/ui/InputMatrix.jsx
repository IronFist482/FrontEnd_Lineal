import { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import styles from '../../styles/inputMatrix.module.css';

const OPERATION_TITLES = {
  Determinante: 'Ingrese su Determinante',
  Inversa: 'Ingrese su Matriz',
  SEL: 'Ingrese su Sistema de Ecuaciones Lineales',
};

const isValidFractionInput = (value) => {
  if (value === '') return true;
  if (/^-?\d*\.?\d*$/.test(value)) return true;
  if (/^-?\d*\/-?\d*$/.test(value)) return true;
  return false;
};

const formatFractionLatex = (value) => {
  if (!value) return '\\;';
  if (/^-?\d+(\.\d+)?$/.test(value)) return value;
  if (/^-?\d+\/-?\d+$/.test(value)) {
    const [num, den] = value.split('/');
    return `\\frac{${num}}{${den}}`;
  }
  return '\\text{?}';
};

const getDefaultMatrices = () => ({
  SEL: Array.from({ length: 2 }, () => Array(3).fill('')),
  Determinante: Array.from({ length: 2 }, () => Array(2).fill('')),
  Inversa: Array.from({ length: 2 }, () => Array(2).fill('')),
});

export function InputMatrix({ onMatrixChange, onError, maxSize = 10, operationtype }) {
  const [matrices, setMatrices] = useState(getDefaultMatrices());
  const [focusCell, setFocusCell] = useState({ r: 0, c: 0 });
  const inputRefs = useRef([]);
  const matrix = matrices[operationtype] || getDefaultMatrices()[operationtype];
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    inputRefs.current = matrix.map((row, r) =>
      inputRefs.current[r]?.slice(0, row.length) || Array(row.length).fill(null)
    );
  }, [matrix]);

  useEffect(() => {
    if (!focusCell) return;
    const { r, c } = focusCell;
    const el = inputRefs.current?.[r]?.[c];
    if (el && typeof el.focus === 'function') {
      requestAnimationFrame(() => {
        const pos = el.selectionStart ?? el.value.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    }
  }, [focusCell, matrix]);

  const updateMatrix = (newMatrix) => {
    setMatrices((prev) => ({
      ...prev,
      [operationtype]: newMatrix,
    }));
  };

  const handleCellChange = (r, c, value) => {
    if (!isValidFractionInput(value)) return;
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[r][c] = value;
    updateMatrix(newMatrix);
    setTimeout(() => setFocusCell({ r, c }), 0);
  };

  const moveFocus = (direction) => {
    let { r, c } = focusCell;
    let expand = false;

    if (direction === 'up') r = Math.max(r - 1, 0);
    if (direction === 'down') {
      r += 1;
      if (r >= matrix.length) expand = true;
    }
    if (direction === 'left') c = Math.max(c - 1, 0);
    if (direction === 'right') {
      c += 1;
      if (c >= matrix[0].length) expand = true;
    }

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
        const newMatrix = matrix.map((row) => [...row, '']);
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
        moveFocus(keyMap[e.key]);
      }
    }
  };

  const handleReset = () => {
    setMatrices((prev) => ({
      ...prev,
      [operationtype]: getDefaultMatrices()[operationtype],
    }));
    setFocusCell({ r: 0, c: 0 });
  };

  const validateMatrixBeforeSend = (matrix) => {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        const cell = matrix[r][c];
        if (cell === '') return 'Hay celdas vacías. Complete todos los valores antes de procesar.';
        if (!isValidFractionInput(cell)) return `El valor "${cell}" no es válido.`;
      }
    }
    return null;
  };

  const getWrapper = () => {
    const cols = matrix[0]?.length || 2;
    let latexBody = '';

    switch (operationtype) {
      case 'Determinante':
        latexBody = matrix.map((row) => row.map(formatFractionLatex).join(' & ')).join('\\\\');
        return `\\left|\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right|`;
      case 'Inversa':
        latexBody = matrix.map((row) => row.map(formatFractionLatex).join(' & ')).join('\\\\');
        return `\\left[\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right]`;
      case 'SEL': {
        const coefCols = matrix[0].length - 1;
        const latexRows = matrix
          .map((row) =>
            row
              .map((cell, i) => {
                if (i < coefCols) {
                  if (cell.trim() === '-') return '-x_{' + (i + 1) + '}';
                  if (cell.trim().startsWith('-')) return `${formatFractionLatex(cell)}x_{${i + 1}}`;
                  return `${formatFractionLatex(cell)}x_{${i + 1}}`;
                }
                return `${formatFractionLatex(cell)}`;
              })
              .slice(0, coefCols + 1)
              .join(' + ')
              .replace(/\+ -/g, '- ')
              .replace(/\+ \+/g, '+ ')
          )
          .join('\\\\');
        return `\\left\\{\\begin{array}{l}${latexRows}\\end{array}\\right.`;
      }
      default:
        latexBody = matrix.map((row) => row.map(formatFractionLatex).join(' & ')).join('\\\\');
        return `\\left(\\begin{array}{${'c'.repeat(cols)}}${latexBody}\\end{array}\\right)`;
    }
  };

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixHeader}>
        <h3 className={styles.matrixTitle}>{OPERATION_TITLES[operationtype]}</h3>
        <button className={styles.buttonReset} onClick={handleReset}>Reiniciar</button>
      </div>

      <div className={styles.matrixDisplay}>
        <BlockMath math={getWrapper()} />
      </div>

      <div className={styles.matrixGridWrapper}>
        <table className={styles.matrixGrid}>
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={`cell-${r}-${c}`}>
                    <input
                      type="text"
                      value={cell}
                      ref={(el) => {
                        if (!inputRefs.current[r]) inputRefs.current[r] = [];
                        inputRefs.current[r][c] = el;
                      }}
                      onFocus={() => setFocusCell({ r, c })}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className={styles.matrixInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className={styles.buttonProcess}
        onClick={() => {
          const error = validateMatrixBeforeSend(matrix);
          if (error) {
            console.error("❌ Error en matriz:", error);
            if (onError) onError(error);
            return;
          }
          onMatrixChange(matrix);
        }}
      >
        Procesar matriz
      </button>
    </div>
  );
}
