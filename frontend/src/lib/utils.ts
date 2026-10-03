import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ScryfallCard } from "#/features/scryfall/types";
import type { DataCard } from "#/features/collection/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ParsedLine {
  raw: string;
  qty: number;
  name: string;
  set?: string | undefined;
  collectorNumber?: string | undefined;
  zone: "main" | "side" | "commander";
}

const HEADERS: Record<string, "main" | "side" | "commander"> = {
  deck: "main",
  mazo: "main",
  main: "main",
  maindeck: "main",
  sideboard: "side",
  banquillo: "side",
  side: "side",
  reserva: "side",
  commander: "commander",
  comandante: "commander",
};

export function parseDecklist(text: string): ParsedLine[] {
  const out: ParsedLine[] = [];
  let zone: "main" | "side" | "commander" = "main";

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("//") || line.startsWith("#")) continue;

    const headerKey = line.replace(/[:\s]+$/, "").toLowerCase();
    if (HEADERS[headerKey]) {
      zone = HEADERS[headerKey];
      continue;
    }

    const match = line.match(
      /^(\d+)\s*[xX]?\s+(.+?)(?:\s*\(([A-Za-z0-9]{2,6})\)\s*([A-Za-z0-9\u2605-]+))?\s*(?:\*F\*)?$/,
    );
    if (!match) {
      out.push({ raw: rawLine, qty: 1, name: line, zone });
      continue;
    }
    const [, qty, name, set, number] = match;
    out.push({
      raw: rawLine,
      qty: Math.max(1, Number(qty)),
      name: (name ?? line)
        .trim()
        .replace(/\s+\/\/.*$/, "")
        .trim(),
      set: set?.toLowerCase(),
      collectorNumber: number,
      zone,
    });
  }
  return out;
}

export function groupCardsByType<T extends DataCard>(
  cards: { card: ScryfallCard; dataCard: T }[],
) {
  const groups: Record<string, typeof cards> = {};

  for (const item of cards) {
    const typeLine = item.card.type_line || "Unknown";

    if (!typeLine) {
      const mainType = "Unknown";
      if (!groups[mainType]) groups[mainType] = [];
      groups[mainType].push(item);
      continue;
    }

    const typeParts = typeLine.split(" ").filter((part) => part.trim() !== "");

    const nonPrimaryTypes = ["Legendary", "Basic", "Snow", "World", "Ongoing"];

    let mainType = "Unknown";

    for (const part of typeParts) {
      if (!nonPrimaryTypes.includes(part)) {
        mainType = part;
        break;
      }
    }

    if (mainType === "Unknown" && typeParts.length > 0) {
      mainType = typeParts[typeParts.length - 1];
    }

    if (!mainType || mainType.trim() === "") {
      mainType = "Unknown";
    }

    if (!groups[mainType]) {
      groups[mainType] = [];
    }
    groups[mainType].push(item);
  }

  return groups;
}

export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function symbolUrl(symbol: string) {
  const code = symbol.replace(/[{}]/g, "").replace(/\//g, "");
  return `https://svgs.scryfall.io/card-symbols/${code.toUpperCase()}.svg`;
}

export function processOracleText(text: string | undefined) {
  if (!text) return "";

  return text.replace(/\{[^}]+\}/g, (match) => {
    const imgSrc = symbolUrl(match);
    return `<img src="${imgSrc}" alt="${match}" class="h-3.5 w-3.5 inline align-middle" />`;
  });
}
