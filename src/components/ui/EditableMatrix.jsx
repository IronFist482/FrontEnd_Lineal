import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { toFrac } from '../../utils/formatFraction';

function isIncompleteFraction(value) {
  if (!value) return false;
  return (
    /^-?\/$/.test(value) ||   
    /^-?\d+\/$/.test(value) || 
    /^\/-?\d+$/.test(value)    
  );
}

function latexToSimpleFraction(str) {
  if (!str) return str;

  const fracRegex = /^-?\\frac\{(-?\d+)\}\{(-?\d+)\}$/;
  const match = str.match(fracRegex);

  if (match) {
    const num = match[1];
    const den = match[2];
    const sign = str.startsWith("-") ? "-" : "";
    return `${sign}${num}/${den}`;
  }

  return str;
}

export function validateMatrixForSubmit(matrix) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      const v = matrix[r][c];

      if (v === "") {
        return "No puedes enviar la matriz con campos vacíos. Todos deben ser números o fracciones.";
      }

      if (isIncompleteFraction(v)) {
        return "Hay fracciones incompletas como '3/' o '/5'. Corrige antes de enviar.";
      }

      if (!/^-?\d+(\.\d+)?$/.test(v) && !/^-?\d+\/-?\d+$/.test(v)) {
        return "Hay valores no válidos. Solo se permiten números o fracciones.";
      }
    }
  }

  return null; 
}

export function EditableMatrix({
  data,
  operationType,
  isEditable = false,
  onMatrixEdit,
}) {
  const [editableMatrix, setEditableMatrix] = useState(() =>
    data.map(row => row.map(cell => latexToSimpleFraction(cell)))
  );

  // Cuando cambia data externa, convertir nuevamente LaTeX → a/b
  useEffect(() => {
    const converted = data.map(row =>
      row.map(cell => latexToSimpleFraction(cell))
    );
    setEditableMatrix(converted);
  }, [data]);

  // Manejo de cambios en inputs
  const handleCellChange = (r, c, value) => {
    const isValid =
      value === '' ||
      /^-?\d*\.?\d*$/.test(value) ||   // decimal válido
      /^-?\d+\/\d+$/.test(value) ||    // fracción completa a/b
      /^-?\d*\/?$/.test(value);        // fracción incompleta

    if (!isValid) return;

    const updated = editableMatrix.map(row => [...row]);
    updated[r][c] = value;

    setEditableMatrix(updated);

    if (onMatrixEdit) onMatrixEdit(updated);
  };

  const source = isEditable ? editableMatrix : data;

 const rows = source
    .map((row) => {
      const formatted = row
        .map((value) => {
          if (value === "") return "0";

          if (isIncompleteFraction(value)) return "?";

          if (typeof value === 'string' && /^-?\d+\/\d+$/.test(value)) {
            const match = value.match(/^(-?)(\d+)\/(\d+)$/);
            if (match) {
              const sign = match[1];
              const num = match[2];
              const den = match[3];
              return `${sign}\\frac{${num}}{${den}}`;
            }
          }

          return toFrac(value);
        })
        .join(' & ');
      return `${formatted} \\\\[0.5em]`;
    })
    .join(' ');

  let latex;
  const numCols = source[0].length;
  const isAugmented = numCols > source.length;

  switch (operationType) {
    case 'Determinante':
      latex = `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
      break;

    case 'SEL': {
      const arrayColsSEL = 'c '.repeat(numCols - 1) + '| c';
      latex = `\\left[\\begin{array}{${arrayColsSEL}} ${rows} \\end{array}\\right]`;
      break;
    }

    case 'Inversa': {
      if (isAugmented && numCols % 2 === 0) {
        const halfCols = numCols / 2;
        const arrayColsInv =
          'c '.repeat(halfCols) + '| ' + 'c '.repeat(halfCols);
        latex = `\\left[\\begin{array}{${arrayColsInv}} ${rows} \\end{array}\\right]`;
      } else {
        latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
      }
      break;
    }

    default:
      latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  }

  if (isEditable) {
    return (
      <div className="matrix-input-overlay-wrapper editable-result-wrapper">
        <div className="katex-wrapper">
          <BlockMath math={latex} />
        </div>

        <table className="matrix-input-below">
          <tbody>
            {editableMatrix.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td
                    key={`cell-${r}-${c}`}
                    className={
                      operationType === 'SEL' && c < row.length - 1
                        ? 'matrix-variable-cell'
                        : ''
                    }
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(r, c, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="matrix-display-latex">
      <BlockMath math={latex} />
    </div>
  );
}
