export const krw = (n: number): string =>
  Math.round(n).toLocaleString('ko-KR') + '원';

export const pct = (n: number): string =>
  n.toFixed(1) + '%';

export const num = (n: number, decimals = 0): string =>
  n.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
