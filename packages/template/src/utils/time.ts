import { formatInteger, formatNumberWithDecimal } from './format';

export function millisecondsToText(ms: number, fractionDigits = 1) {
  if (ms <= 1000) return `${formatInteger(ms)}ms`;
  return `${formatNumberWithDecimal(ms / 1000, fractionDigits)}s`;
}
