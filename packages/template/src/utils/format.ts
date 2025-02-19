let formatter: Intl.NumberFormat | undefined;

try {
  formatter = new Intl.NumberFormat('en-US');
} catch {}

export function formatInteger(value: number) {
  return formatter?.format(value) ?? value.toString();
}

export function formatNumberWithDecimal(value: number, fractionDigits = 1) {
  const segments = value.toFixed(fractionDigits).split('.', 2);
  return formatInteger(+segments[0]) + '.' + segments[1];
}
