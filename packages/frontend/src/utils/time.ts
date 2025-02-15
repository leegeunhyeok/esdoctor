import { formatInteger, formatNumberWithDecimal } from './format';

export function millisecondsToText(ms: number) {
  if (ms <= 1000) return `${formatInteger(ms)}ms`;
  return `${formatNumberWithDecimal(ms / 1000)}s`;
}
