import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { toFrac } from '../../utils/formatFraction';

export function EditableMatrix({
  data,
  operationType,
  isEditable = false, // Activar edición solo cuando se necesite
  onMatrixEdit,       // Callback para notificar cambios
}) {
  const [editableMatrix, setEditableMatrix] = useState(data);

  // Sincroniza el estado si 'data' cambia
  useEffect(() => {
    setEditableMatrix(data);
  }, [data]);

  // Maneja cambios en celdas
  const handleCellChange = (r, c, value) => {
    const isValid = value === '' || /^-?\d*\.?\d*$/.test(value);
    if (!isValid) return;

    const newMatrix = editableMatrix.map(row => [...row]);
    newMatrix[r][c] = value;
    setEditableMatrix(newMatrix);

    if (onMatrixEdit) onMatrixEdit(newMatrix);
  };

  // Genera LaTeX
  const numCols = data[0].length;
  const isAugmented = numCols > data.length;

  const rows = (isEditable ? editableMatrix : data)
    .map((row, i) => {
      const formattedRow = row.map(value => isEditable ? value : toFrac(value)).join(' & ');
      return i < data.length - 1 ? `${formattedRow} \\\\[0.5em]` : formattedRow;
    })
    .join(' ');

  let latex;
  switch (operationType) {
    case 'Determinante':
      latex = `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
      break;
    case 'SEL':
      const arrayColsSEL = 'c '.repeat(numCols - 1) + '| c';
      latex = `\\left[\\begin{array}{${arrayColsSEL}} ${rows} \\end{array}\\right]`;
      break;
    case 'Inversa':
      if (isAugmented && numCols % 2 === 0) {
        const halfCols = numCols / 2;
        const arrayColsInv = 'c '.repeat(halfCols) + '| ' + 'c '.repeat(halfCols);
        latex = `\\left[\\begin{array}{${arrayColsInv}} ${rows} \\end{array}\\right]`;
      } else {
        latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
      }
      break;
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
            {editableMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}
                    className={operationType === 'SEL' && colIndex < row.length - 1 ? 'matrix-variable-cell' : ''}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={cell}
                      onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
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
