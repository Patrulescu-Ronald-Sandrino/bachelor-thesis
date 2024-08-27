export function forEachError(
  data: unknown,
  callback: (field: string, messages: string[], i: number) => void,
): void {
  if (!data) return;

  Object.entries(data as { [key: string]: string[] }).forEach(
    ([field, fieldErrors], i) => {
      const fieldCamelCase =
        field.charAt(0).toLocaleLowerCase() + field.slice(1);

      callback(fieldCamelCase, fieldErrors, i);
    },
  );
}
