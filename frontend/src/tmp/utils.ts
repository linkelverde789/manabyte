import type { CollectionItem } from "#/features/collection/types";
import type { DeckCard } from "#/features/deckCards/types";
import type { ScryfallCard } from "#/features/scryfall/types";

export function groupCardsByType(
  cards: { card: ScryfallCard; dataCard: DeckCard | CollectionItem }[],
) {
  const groups: Record<string, typeof cards> = {};
  for (const item of cards) {
    const typeLine = item.card.type_line || "Unknown";
    const mainType = typeLine.split(" ")[0];

    if (!groups[mainType]) {
      groups[mainType] = [];
    }
    groups[mainType].push(item);
  }

  return groups;
}

export function groupCardsByTypeCollection(
  cards: { card: ScryfallCard; dataCard: CollectionItem }[],
) {
  const groups: Record<string, typeof cards> = {};
  for (const item of cards) {
    const typeLine = item.card.type_line || "Unknown";
    const splited_typeLine = typeLine.split(" ");
    const mainType =
      splited_typeLine[0].toLocaleLowerCase() !== "legendary" &&
      splited_typeLine[0].toLocaleLowerCase() !== "basic"
        ? splited_typeLine[0]
        : splited_typeLine[1];

    if (!groups[mainType]) {
      groups[mainType] = [];
    }
    groups[mainType].push(item);
  }

  return groups;
}
