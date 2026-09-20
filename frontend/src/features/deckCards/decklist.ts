export interface ParsedLine {
  raw: string;
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
}

export function parseDecklist(text: string): ParsedLine[] {
  const result: ParsedLine[] = [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const raw of lines) {
    const match = raw.match(/^(\d+)?\s*(?:\(([^)]+)\)\s*(\S+))$/);

    if (!match) {
      const simpleMatch = raw.match(/^(\d+)?\s+(.+)$/);
      if (simpleMatch) {
        const [, quantity, name] = simpleMatch;
        result.push({
          raw,
          quantity: quantity ? Number(quantity) : 1,
          name: name.trim(),
          set: undefined,
          collectorNumber: undefined,
        });
      } else {
        result.push({
          raw,
          quantity: 1,
          name: raw.trim(),
          set: undefined,
          collectorNumber: undefined,
        });
      }
      continue;
    }

    const [, quantity, set, collectorNumber] = match;

    if (set && collectorNumber) {
      result.push({
        raw,
        quantity: quantity ? Number(quantity) : 1,
        name: "",
        set: set.toLowerCase(),
        collectorNumber,
      });
    } else {
      result.push({
        raw,
        quantity: quantity ? Number(quantity) : 1,
        name: raw.trim(),
        set: undefined,
        collectorNumber: undefined,
      });
    }
  }

  return result;
}
