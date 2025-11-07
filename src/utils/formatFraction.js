import Fraction from "fraction.js";

export function toFrac(value) {
  if (typeof value === "string" && !isNaN(value)) {
    value = Number(value);
  }
  if (typeof value === "string" && value.includes("\\frac")) {
    return value;
  }
  if (typeof value === "number") {
    value = Number(value.toFixed(10));

    if (Number.isInteger(value)) {
      return `${value}`;
    }
    const frac = new Fraction(value);
    if (frac.d === 1) {
      return `${frac.n}`;
    }
    return `\\frac{${frac.n}}{${frac.d}}`;
  }

  return value;
}


export function matrixToFraction(matrix) {
  return matrix.map(row => row.map(value => toFrac(value)));
}
