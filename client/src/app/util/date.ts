export function formatDateDetailed(date: Date | string) {
  const result = date instanceof Date ? date : new Date(date);
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
  return new Date(date1).getTime() - new Date(date2).getTime();
}
