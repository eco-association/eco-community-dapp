export function convertDate(date: string | number) {
  if (!date) return null;
  return new Date(parseInt(date.toString()) * 1000);
}
