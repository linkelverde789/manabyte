export interface ParsedLine {
  raw: string;
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
  foil?: boolean;
}

export function parseDecklist(text: string): ParsedLine[] {
  const result: ParsedLine[] = [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const raw of lines) {
    const hasFoil = raw.trim().endsWith("*");
    const rawWithoutFoil = hasFoil
      ? raw.trim().slice(0, -1).trim()
      : raw.trim();

    const match = rawWithoutFoil.match(/^(\d+)?\s*(?:\(([^)]+)\)\s*(\S+))$/);

    if (!match) {
      const simpleMatch = rawWithoutFoil.match(/^(\d+)?\s+(.+)$/);
      if (simpleMatch) {
        const [, quantity, name] = simpleMatch;
        result.push({
          raw,
          quantity: quantity ? Number(quantity) : 1,
          name: name.trim(),
          set: undefined,
          collectorNumber: undefined,
          foil: hasFoil,
        });
      } else {
        result.push({
          raw,
          quantity: 1,
          name: rawWithoutFoil.trim(),
          set: undefined,
          collectorNumber: undefined,
          foil: hasFoil,
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
        foil: hasFoil,
      });
    } else {
      result.push({
        raw,
        quantity: quantity ? Number(quantity) : 1,
        name: rawWithoutFoil.trim(),
        set: undefined,
        collectorNumber: undefined,
        foil: hasFoil,
      });
    }
  }

  return result;
}
