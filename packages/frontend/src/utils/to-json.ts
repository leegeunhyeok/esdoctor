export function toJSON(data: unknown) {
  return JSON.stringify(
    data,
    (_key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }

      if (value instanceof Set) {
        return Array.from(value);
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      if (value instanceof RegExp) {
        return value.toString();
      }

      if (value instanceof Function) {
        return `[function ${value.name ?? 'anonymous'}]`;
      }

      return value;
    },
    2,
  );
}
