export function truncateText(
  text: string,
  length = 60,
  ending = "..."
): string {
  if (text.length < length) return text;
  return text.substring(0, length - ending.length) + ending;
}
