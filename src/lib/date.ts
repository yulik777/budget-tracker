export function getMonth(date: string) {
  return new Date(date).getMonth();
}

export function getYear(date: string) {
  return new Date(date).getFullYear();
}

export function isSameMonth(date: string, month: number, year: number) {
  const d = new Date(date);
  return d.getMonth() === month && d.getFullYear() === year;
}
