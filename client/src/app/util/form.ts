export function forEachError(
  data: unknown,
  callback: (field: string, message: string) => void,
): void {
  if (!data) return;
  Object.entries(data as { [key: string]: string[] }).forEach(
    ([field, fieldErrors]) => {
      fieldErrors.forEach((error) => {
        const fieldCamelCase =
          field.charAt(0).toLocaleLowerCase() + field.slice(1);
        callback(fieldCamelCase, error);
      });
    },
  );
}
