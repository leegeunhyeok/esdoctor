import { formatInteger, formatNumberWithDecimal } from './format';

export function bytesToText(bytes: number) {
  if (bytes === 1) return '1 byte';
  if (bytes < 1024) return `${formatInteger(bytes)} bytes`;
  if (bytes < 1024 * 1024) return `${formatNumberWithDecimal(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${formatNumberWithDecimal(bytes / 1024 / 1024)} MB`;
  return `${formatNumberWithDecimal(bytes / 1024 / 1024 / 1024)} GB`;
}
