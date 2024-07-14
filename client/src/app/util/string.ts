export function splitByCapitalLetter(str: string) {
  return str.split(/(?=[A-Z])/).join(' ');
}
