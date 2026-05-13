/**
 * Tokenize a line respecting double-quoted segments.
 */
export function tokenizeLine(line: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const s = line.trim();
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i]!)) i++;
    if (i >= s.length) break;
    if (s[i] === '"') {
      i++;
      let chunk = "";
      while (i < s.length && s[i] !== '"') {
        chunk += s[i]!;
        i++;
      }
      if (s[i] === '"') i++;
      tokens.push(chunk);
    } else {
      let chunk = "";
      while (i < s.length && !/\s/.test(s[i]!)) {
        chunk += s[i]!;
        i++;
      }
      tokens.push(chunk);
    }
  }
  return tokens;
}

export type ParsedCli = {
  command: string;
  flags: Record<string, string | boolean>;
  /** Positional args after command (excluding flag pairs). */
  positionals: string[];
};

/**
 * Parse `command [--flag value]...` with quoted values.
 */
export function parseCli(line: string): ParsedCli {
  const tokens = tokenizeLine(line);
  if (tokens.length === 0) {
    return { command: "", flags: {}, positionals: [] };
  }

  const command = tokens[0]!.toLowerCase();
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  let j = 1;
  while (j < tokens.length) {
    const t = tokens[j]!;
    if (t.startsWith("--")) {
      const key = t.slice(2).toLowerCase();
      const next = tokens[j + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        j += 2;
      } else {
        flags[key] = true;
        j += 1;
      }
    } else {
      positionals.push(t);
      j += 1;
    }
  }

  return { command, flags, positionals };
}
