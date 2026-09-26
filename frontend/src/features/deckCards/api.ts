import { api } from "../../api/manabyte";
import type { CreateDeckCardData, DeckCard } from "./types";

export function getDeckCards(deckId: string) {
  return api<DeckCard[]>(`/deck/${deckId}/cards/`);
}

export function createDeckCard(deckId: string, data: CreateDeckCardData) {
  return api<DeckCard>(`/deck/${deckId}/cards/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function bulkCreateDeckCard(deckId: string, data: CreateDeckCardData[]) {
  return api<DeckCard[]>(`/deck/${deckId}/cards/bulk/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface PartialUpdateDeckCardData {
  quantity?: number;
  scryfall_id?: string;
}

export function partialUpdateDeckCard(
  deckId: string,
  cardId: string,
  data: PartialUpdateDeckCardData,
) {
  return api<DeckCard>(`/deck/${deckId}/cards/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteDeckCard(deckId: string, cardId: string) {
  return api<number>(`/deck/${deckId}/cards/${cardId}/`, { method: "DELETE" });
}
