
const areEqual = (a, b, tolerance = 1e-10) => {
  return Math.abs(a - b) < tolerance;
};


const findPivot = (row) => {
  for (let i = 0; i < row.length; i++) {
    if (Math.abs(row[i]) > 1e-10) {
      return { col: i, value: row[i] };
    }
  }
  return null;
};


const detectRowSwap = (matrixBefore, matrixAfter) => {
  const n = matrixBefore.length;
  
  for (let i = 0; i < n; i++) {
    let foundMatch = false;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      
      const isMatch = matrixBefore[i].every((val, k) => 
        areEqual(val, matrixAfter[j][k])
      );
      
      if (isMatch) {
        const isSwap = matrixBefore[j].every((val, k) => 
          areEqual(val, matrixAfter[i][k])
        );
        
        if (isSwap) {
          return { row1: i + 1, row2: j + 1 }; 
        }
      }
    }
  }
  
  return null;
};


const detectRowMultiplication = (matrixBefore, matrixAfter) => {
  const n = matrixBefore.length;
  
  for (let i = 0; i < n; i++) {
    let factor = null;
    for (let j = 0; j < matrixBefore[i].length; j++) {
      if (Math.abs(matrixBefore[i][j]) > 1e-10) {
        factor = matrixAfter[i][j] / matrixBefore[i][j];
        break;
      }
    }
    
    if (factor === null || areEqual(factor, 1)) continue;
    
    const allMultiplied = matrixBefore[i].every((val, j) => {
      if (Math.abs(val) < 1e-10 && Math.abs(matrixAfter[i][j]) < 1e-10) {
        return true; 
      }
      return areEqual(matrixAfter[i][j], val * factor);
    });
    
    if (allMultiplied) {
      const otherRowsUnchanged = matrixBefore.every((row, k) => {
        if (k === i) return true;
        return row.every((val, j) => areEqual(val, matrixAfter[k][j]));
      });
      
      if (otherRowsUnchanged) {
        return { row: i + 1, factor };
      }
    }
  }
  
  return null;
};


const detectEliminationOperations = (matrixBefore, matrixAfter, pivotRow, pivotCol) => {
  const operations = [];
  const n = matrixBefore.length;
  
  for (let i = 0; i < n; i++) {
    if (i === pivotRow) continue;
    
    const rowChanged = !matrixBefore[i].every((val, j) => 
      areEqual(val, matrixAfter[i][j])
    );
    
    if (!rowChanged) continue;
    
    const pivotValue = matrixBefore[pivotRow][pivotCol];
    const targetValue = matrixBefore[i][pivotCol];
    
    if (Math.abs(pivotValue) < 1e-10) continue;
    
    const factor = -targetValue / pivotValue;
    
    const isValidOperation = matrixBefore[i].every((val, j) => {
      const expected = val + factor * matrixBefore[pivotRow][j];
      return areEqual(matrixAfter[i][j], expected);
    });
    
    if (isValidOperation) {
      operations.push({
        targetRow: i + 1,
        pivotRow: pivotRow + 1,
        factor
      });
    }
  }
  
  return operations.length > 0 ? operations : null;
};


const findCurrentPivot = (matrixBefore, matrixAfter) => {
  const n = matrixBefore.length;
  const m = matrixBefore[0].length;
  
  for (let col = 0; col < m; col++) {
    for (let row = 0; row < n; row++) {
      const pivot = findPivot(matrixBefore[row]);
      if (pivot && pivot.col === col && Math.abs(matrixBefore[row][col]) > 1e-10) {
        const hasChanges = matrixBefore.some((r, i) => 
          !areEqual(r[col], matrixAfter[i][col])
        );
        
        if (hasChanges) {
          return { row, col };
        }
      }
    }
  }
  
  return { row: 0, col: 0 }; 
};


export const analyzeOperation = (matrixBefore, matrixAfter, pasoId) => {
  if (!matrixBefore || !matrixAfter) return null;
  
  const operationType = pasoId?.[0];
  
  switch (operationType) {
    case 1: { 
      const swap = detectRowSwap(matrixBefore, matrixAfter);
      if (swap) {
        return `F_{${swap.row1}} \\leftrightarrow F_{${swap.row2}}`;
      }
      return `F_{${pasoId[1] + 1}} \\leftrightarrow F_{${pasoId[2] + 1}}`;
    }
    
    case 2: { 
      const mult = detectRowMultiplication(matrixBefore, matrixAfter);
      if (mult) {
        const factorStr = formatFactor(mult.factor);
        return `${factorStr} F_{${mult.row}} \\to F_{${mult.row}}`;
      }
      return `n F_{p} \\to F_{p}`;
    }
    
    case 3: { 
      const pivot = findCurrentPivot(matrixBefore, matrixAfter);
      const operations = detectEliminationOperations(
        matrixBefore, 
        matrixAfter, 
        pivot.row, 
        pivot.col
      );
      
      if (operations) {
        return operations.map(op => {
          const factorStr = formatFactorForElimination(Math.abs(op.factor));
          const sign = op.factor >= 0 ? '+' : '-';
          
          const factorDisplay = factorStr === '' ? '' : factorStr;
          
          return `F_{${op.targetRow}} ${sign} ${factorDisplay}F_{${op.pivotRow}} \\to F_{${op.targetRow}}`;
        }).join(' \\\\[0.3em] ');
      }
      
      return `F_{${pasoId[1] + 1}}, C_{${pivot.col + 1}}`;
    }
    
    case 4: { 
      const pivot = findCurrentPivot(matrixBefore, matrixAfter);
      const operations = detectEliminationOperations(
        matrixBefore, 
        matrixAfter, 
        pivot.row, 
        pivot.col
      );
      
      if (operations) {
        return operations.map(op => {
          const factorStr = formatFactorForElimination(Math.abs(op.factor));
          const sign = op.factor >= 0 ? '+' : '-';
                    const factorDisplay = factorStr === '' ? '' : factorStr;
          
          return `F_{${op.targetRow}} ${sign} ${factorDisplay}F_{${op.pivotRow}} \\to F_{${op.targetRow}}`;
        }).join(' \\\\[0.3em] ');
      }
      
      return `F_{${pasoId[1] + 1}}, C_{${pivot.col + 1}}`;
    }
    
    default:
      return null;
  }
};

const formatFactor = (factor) => {
  if (areEqual(factor, Math.round(factor))) {
    return Math.round(factor).toString();
  }
  
  const frac = approximateFraction(factor);
  if (frac) {
    return `\\frac{${frac.num}}{${frac.den}}`;
  }
  
  return factor.toFixed(4);
};


const formatFactorForElimination = (factor) => {
  const absFactor = Math.abs(factor);
  
  if (areEqual(absFactor, 1)) {
    return '';
  }
  
  if (areEqual(absFactor, Math.round(absFactor))) {
    return Math.round(absFactor).toString();
  }
  
  const frac = approximateFraction(absFactor);
  if (frac) {
    return `\\frac{${frac.num}}{${frac.den}}`;
  }
  
  return absFactor.toFixed(4);
};

const approximateFraction = (decimal, maxDenominator = 100) => {
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  
  let bestNum = Math.round(decimal);
  let bestDen = 1;
  let bestError = Math.abs(decimal - bestNum);
  
  for (let den = 2; den <= maxDenominator; den++) {
    const num = Math.round(decimal * den);
    const error = Math.abs(decimal - num / den);
    
    if (error < bestError && error < 0.001) {
      bestNum = num;
      bestDen = den;
      bestError = error;
    }
  }
  
  if (bestDen === 1) return null;
  
  return { num: sign * bestNum, den: bestDen };
};