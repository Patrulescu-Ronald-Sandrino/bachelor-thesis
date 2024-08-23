export function stringToDate(value: string) {
  const valueUtc = value.endsWith('Z') ? value : value + 'Z';
  return new Date(valueUtc);
}

export function formatDateDetailed(date: Date | string) {
  const result = date instanceof Date ? date : stringToDate(date);
  return result.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    fractionalSecondDigits: 3,
  });
}

export function dateDiff(date1: string, date2: string) {
  const dateToNumber = (date: string) => new Date(stringToDate(date)).getTime();

  return dateToNumber(date1) - dateToNumber(date2);
}
