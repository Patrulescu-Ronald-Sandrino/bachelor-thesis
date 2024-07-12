export function shallowCopy<T>(obj: T): T {
  return { ...obj };
}
