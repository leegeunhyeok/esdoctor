let formatter: Intl.NumberFormat | undefined;

try {
  formatter = new Intl.NumberFormat('en-US');
} catch {}

export function formatInteger(value: number) {
  return formatter?.format(value) ?? value.toString();
}

export function formatNumberWithDecimal(value: number) {
  const segments = value.toFixed(1).split('.', 2);
  return formatInteger(+segments[0]) + '.' + segments[1];
}
