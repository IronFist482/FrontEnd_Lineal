import Fraction from "fraction.js";


export function toFrac(value) {
  if (typeof value === "string" && value.includes("\\frac")) {
    return value;
  }

  if (typeof value === "string" && !isNaN(value.trim())) {
    value = Number(value.trim());
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "number") {
    value = Number(value.toFixed(10));
    if (Number.isInteger(value)) {
      return `${value}`;
    }

    const sign = value < 0 ? "-" : "";
    const absValue = Math.abs(value);

    const frac = new Fraction(absValue);

    const n =
      typeof frac.n === "bigint" ? frac.n : BigInt(frac.n);
    const d =
      typeof frac.d === "bigint" ? frac.d : BigInt(frac.d);

    return `${sign}\\frac{${n.toString()}}{${d.toString()}}`;
  }

  return value;
}

export function matrixToFraction(matrix) {
  if (!Array.isArray(matrix)) return matrix;

  return matrix.map((row) =>
    row.map((value) => toFrac(value))
  );
}
