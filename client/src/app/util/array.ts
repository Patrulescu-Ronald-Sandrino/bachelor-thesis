export function generate(start: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start + i);
}

export function swap<T>(array: T[], i: number, j: number): T[] {
  const newArray = [...array];
  [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  return newArray;
}
