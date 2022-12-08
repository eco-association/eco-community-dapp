export function convertDate(date: string | number) {
  return new Date(parseInt(date.toString()) * 1000);
}
