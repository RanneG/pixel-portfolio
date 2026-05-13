/** Default wrap width for terminal and browse prose. */
export const WRAP_WIDTH = 72;

export function wrapText(s: string, width: number = WRAP_WIDTH): string[] {
  const lines: string[] = [];
  let remaining = s.trim();
  while (remaining.length > width) {
    let cut = remaining.lastIndexOf(" ", width);
    if (cut <= 0) cut = width;
    lines.push(remaining.slice(0, cut).trimEnd());
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) lines.push(remaining);
  return lines;
}
