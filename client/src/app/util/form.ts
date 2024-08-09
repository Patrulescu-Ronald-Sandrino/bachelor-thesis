export function forEachError(
  data: unknown,
  callback: (field: string, messages: string[]) => void,
): void {
  if (!data) return;

  Object.entries(data as { [key: string]: string[] }).forEach(
    ([field, fieldErrors]) => {
      const fieldCamelCase =
        field.charAt(0).toLocaleLowerCase() + field.slice(1);

      callback(fieldCamelCase, fieldErrors);
    },
  );
}
