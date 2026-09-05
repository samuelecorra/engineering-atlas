export function sum(values) {
  if (!Array.isArray(values) || !values.every(Number.isFinite)) throw new TypeError('Expected finite numbers');
  return values.reduce((total, value) => total + value, 0);
}
