import Fraction from "fraction.js";

export function toFrac(value) {
  if (typeof value === "string" && !isNaN(value)) {
    value = Number(value);
  }

  if (typeof value === "number") {
    const frac = new Fraction(value);
    return frac.toFraction(true); 
  }

  return value;
}


export function matrixToFraction(matrix) {
  return matrix.map(row => row.map(value => toFrac(value)));
}
