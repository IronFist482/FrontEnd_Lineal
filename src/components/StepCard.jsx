import '../styles/StepCard.css';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { toFrac } from '../utils/formatFraction';

export default function StepCard({ 
  stepNumber, 
  operationName, 
  operationDetail, 
  matrix, 
  operationType 
}) {
  const renderMatrixLatex = (matrix, opType) => {
    if (!matrix || matrix.length === 0) return <span>Matriz no disponible</span>;
    
    const numCols = matrix[0].length;
    const rows = matrix
      .map((row, i) => {
        const formattedRow = row.map(value => toFrac(value)).join(' & ');
        return i < matrix.length - 1 ? `${formattedRow} \\\\[0.5em]` : formattedRow;
      })
      .join(' ');
    
    let latex;
    switch (opType) {
      case 'Determinante':
        latex = `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
        break;
      case 'SEL':
        const arrayColsSEL = 'c '.repeat(numCols - 1) + '| c';
        latex = `\\left[\\begin{array}{${arrayColsSEL}} ${rows} \\end{array}\\right]`;
        break;
      case 'Inversa':
        const halfColsInv = numCols / 2;
        const arrayColsInv = 'c '.repeat(halfColsInv) + '| ' + 'c '.repeat(halfColsInv - 1) + 'c';
        latex = `\\left[\\begin{array}{${arrayColsInv}} ${rows} \\end{array}\\right]`;
        break;
      default:
        latex = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
    }
    
    return <BlockMath math={latex} />;
  };

  return (
    <div className="step-card">
      <div className="step-header">
        <h3>Paso {stepNumber}</h3>
        <p className="operation-name">{operationName}</p>
      </div>
      
      {operationDetail && (
        <div className="operation-formula">
          <BlockMath math={operationDetail} />
        </div>
      )}
      
      <div className="matrix-container">
        {matrix ? renderMatrixLatex(matrix, operationType) : null}
      </div>
    </div>
  );
}